import MemoryChallenge from "../../models/Games/memoryChallenge.model.js";
import { uploadImage } from "../../services/cloudinary.service.js";
import { notifyAdmins } from "../../services/notifications.service.js";
import {
    DIFFICULTIES,
    STATUSES,
    AdminInputError,
    assertValidId,
    generateUniqueSlug,
    handleAdminError,
    optionalString,
    parseArray,
    parseEnum,
    parseNumber,
    requireString,
    safeDeleteImages,
} from "../../utils/challengeAdmin.helpers.js";

const IMAGE_FOLDER = "Ancient-Wisdom/games/memory-challenges";
const EMPTY_IMAGE = { url: "", publicId: "" };

const PAIR_TYPES = [
    "figure-portrait",
    "landmark-name",
    "event-date",
    "civilization-artifact",
    "custom",
];

const CONTENT_TYPES = ["text", "image"];

// Limite raisonnable pour un plateau (doit rester >= au max du middleware d'upload)
export const MAX_CARDS = 30;

/* =========================
   PARSERS
========================= */

/*
 * cards : tableau JSON de
 *   { pairId, contentType: "text",  text }
 *   { pairId, contentType: "image", imageIndex }          -> nouvelle image
 *                                                            (index dans req.files)
 *   { pairId, contentType: "image", image: { publicId } } -> image existante conservée
 *                                                            (modification uniquement)
 * Les images conservées doivent déjà appartenir à ce défi.
 */
const parseCards = (rawCards, files, existingCards = []) => {
    const parsed = parseArray(rawCards, "Cards");

    if (parsed.length < 4 || parsed.length % 2 !== 0) {
        throw new AdminInputError(
            "Cards must contain an even number of entries (at least 4)"
        );
    }

    if (parsed.length > MAX_CARDS) {
        throw new AdminInputError(`Cards must not exceed ${MAX_CARDS} entries`);
    }

    const existingByPublicId = new Map(
        existingCards
            .filter((card) => card.image?.publicId)
            .map((card) => [card.image.publicId, card.image])
    );

    const usedFileIndexes = new Set();
    const usedPublicIds = new Set();

    const cards = parsed.map((card, index) => {
        const label = `Card ${index + 1}`;

        if (!card || typeof card !== "object") {
            throw new AdminInputError(`${label} is invalid`);
        }

        const pairId = requireString(card.pairId, `${label} pairId`, {
            max: 50,
        });
        const contentType = parseEnum(
            card.contentType,
            CONTENT_TYPES,
            `${label} contentType`
        );

        if (contentType === "text") {
            return {
                pairId,
                contentType,
                text: requireString(card.text, `${label} text`, { max: 300 }),
                image: EMPTY_IMAGE,
            };
        }

        const text = optionalString(card.text, `${label} text`, { max: 300 });

        // Nouvelle image envoyée avec la requête
        if (card.imageIndex !== undefined && card.imageIndex !== null) {
            const fileIndex = parseNumber(
                card.imageIndex,
                `${label} imageIndex`,
                { min: 0, integer: true }
            );

            if (fileIndex >= files.length) {
                throw new AdminInputError(
                    `${label} references an image that was not uploaded`
                );
            }

            if (usedFileIndexes.has(fileIndex)) {
                throw new AdminInputError(
                    `${label} uses an image already used by another card`
                );
            }

            usedFileIndexes.add(fileIndex);

            return { pairId, contentType, text, fileIndex, image: EMPTY_IMAGE };
        }

        // Image existante conservée
        const keptPublicId = card.image?.publicId;
        const keptImage = existingByPublicId.get(keptPublicId);

        if (!keptImage || usedPublicIds.has(keptPublicId)) {
            throw new AdminInputError(`${label} needs an image`);
        }

        usedPublicIds.add(keptPublicId);

        return {
            pairId,
            contentType,
            text,
            image: { url: keptImage.url, publicId: keptImage.publicId },
        };
    });

    // Chaque paire = exactement 2 cartes
    const pairCounts = new Map();

    cards.forEach((card) =>
        pairCounts.set(card.pairId, (pairCounts.get(card.pairId) ?? 0) + 1)
    );

    if ([...pairCounts.values()].some((count) => count !== 2)) {
        throw new AdminInputError(
            "Each pairId must be used by exactly two cards"
        );
    }

    // Pas d'image envoyée qui ne serait utilisée par aucune carte
    if (usedFileIndexes.size !== files.length) {
        throw new AdminInputError(
            "Some uploaded images are not referenced by any card"
        );
    }

    return cards;
};

// Upload des nouvelles images de cartes.
// uploadedImages est rempli au fur et à mesure pour pouvoir nettoyer en cas d'échec.
const uploadCardImages = async (cards, files, uploadedImages) => {
    for (const card of cards) {
        if (card.fileIndex === undefined) continue;

        const uploaded = await uploadImage(files[card.fileIndex], IMAGE_FOLDER);
        uploadedImages.push(uploaded);

        card.image = { url: uploaded.url, publicId: uploaded.publicId };
    }
};

const toStoredCard = ({ pairId, contentType, text, image }) => ({
    pairId,
    contentType,
    text: text ?? "",
    image,
});

const getPublicIds = (cards) =>
    cards.map((card) => card.image?.publicId).filter(Boolean);

/* =========================
   ADD
========================= */

// POST — multipart/form-data (fichiers : champ "cardImages", plusieurs)
export const addMemoryChallenge = async (req, res, next) => {
    const uploadedImages = [];

    try {
        const body = req.body ?? {};
        const files = req.files ?? [];

        const title = requireString(body.title, "Title", { max: 150 });
        const pairType = parseEnum(body.pairType, PAIR_TYPES, "Pair type");
        const cards = parseCards(body.cards, files);
        const explanation = optionalString(body.explanation, "Explanation", {
            max: 2000,
        });
        const difficulty = parseEnum(
            body.difficulty,
            DIFFICULTIES,
            "Difficulty",
            "Easy"
        );
        const status = parseEnum(body.status, STATUSES, "Status", "draft");

        const slug = await generateUniqueSlug(MemoryChallenge, title);

        await uploadCardImages(cards, files, uploadedImages);

        const challenge = await MemoryChallenge.create({
            title,
            slug,
            pairType,
            cards: cards.map(toStoredCard),
            explanation,
            difficulty,
            status,
        });

        await notifyAdmins({
    title: "New Challenge Created",
    message: `A new challenge, "${challenge.title}", has been created on Ancient Wisdom.`,
    type: "NEW_CHALLENGE",
});

        return res.status(201).json({
            success: true,
            message: "Memory challenge created successfully",
            data: challenge,
        });
    } catch (err) {
        await safeDeleteImages(uploadedImages.map((image) => image.publicId));
        return handleAdminError(err, res, next);
    }
};

/* =========================
   UPDATE
========================= */

// PUT — modification partielle.
// Si "cards" est envoyé, il remplace toute la liste (voir parseCards pour le format).
export const updateMemoryChallenge = async (req, res, next) => {
    const uploadedImages = [];

    try {
        const { id } = req.params;
        assertValidId(id, "memory challenge ID");

        const existing = await MemoryChallenge.findById(id);

        if (!existing) {
            throw new AdminInputError("Memory challenge not found", 404);
        }

        const body = req.body ?? {};
        const files = req.files ?? [];
        const updates = {};

        if (body.title !== undefined) {
            updates.title = requireString(body.title, "Title", { max: 150 });
        }

        if (body.pairType !== undefined) {
            updates.pairType = parseEnum(
                body.pairType,
                PAIR_TYPES,
                "Pair type"
            );
        }

        let newCards;

        if (body.cards !== undefined) {
            newCards = parseCards(body.cards, files, existing.cards);
        } else if (files.length > 0) {
            throw new AdminInputError(
                "Card images were uploaded without the cards field"
            );
        }

        if (body.explanation !== undefined) {
            updates.explanation = optionalString(
                body.explanation,
                "Explanation",
                { max: 2000 }
            );
        }

        if (body.difficulty !== undefined) {
            updates.difficulty = parseEnum(
                body.difficulty,
                DIFFICULTIES,
                "Difficulty"
            );
        }

        if (body.status !== undefined) {
            updates.status = parseEnum(body.status, STATUSES, "Status");
        }

        if (newCards) {
            await uploadCardImages(newCards, files, uploadedImages);
            updates.cards = newCards.map(toStoredCard);
        }

        if (Object.keys(updates).length === 0) {
            throw new AdminInputError("No modifications provided");
        }

        const updated = await MemoryChallenge.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!updated) {
            throw new AdminInputError("Memory challenge not found", 404);
        }

        // Anciennes images retirées des cartes : supprimées après la réussite de la mise à jour
        if (updates.cards) {
            const keptIds = new Set(getPublicIds(updates.cards));
            const removedIds = getPublicIds(existing.cards).filter(
                (publicId) => !keptIds.has(publicId)
            );

            await safeDeleteImages(removedIds);
        }

        return res.status(200).json({
            success: true,
            message: "Memory challenge updated successfully",
            data: updated,
        });
    } catch (err) {
        await safeDeleteImages(uploadedImages.map((image) => image.publicId));
        return handleAdminError(err, res, next);
    }
};

/* =========================
   DELETE
========================= */

export const deleteMemoryChallenge = async (req, res, next) => {
    try {
        const { id } = req.params;
        assertValidId(id, "memory challenge ID");

        const existing = await MemoryChallenge.findById(id);

        if (!existing) {
            throw new AdminInputError("Memory challenge not found", 404);
        }

        await MemoryChallenge.findByIdAndDelete(id);
        await safeDeleteImages(getPublicIds(existing.cards));

        return res.status(200).json({
            success: true,
            message: "Memory challenge deleted successfully",
        });
    } catch (err) {
        return handleAdminError(err, res, next);
    }
};
