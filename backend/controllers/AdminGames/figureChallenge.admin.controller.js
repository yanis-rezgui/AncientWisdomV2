import FigureChallenge from "../../models/Games/figureChallenge.model.js";
import { uploadImage } from "../../services/cloudinary.service.js";
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
    parseStringArray,
    requireString,
    safeDeleteImage,
} from "../../utils/challengeAdmin.helpers.js";

const IMAGE_FOLDER = "Ancient-Wisdom/games/figure-challenges";
const EMPTY_IMAGE = { url: "", publicId: "" };

/* =========================
   PARSERS
========================= */

// clues : [{ text, points }] — au moins 2 indices
const parseClues = (clues) => {
    const normalized = parseArray(clues, "Clues").map((clue, index) => {
        if (!clue || typeof clue !== "object") {
            throw new AdminInputError(`Clue ${index + 1} is invalid`);
        }

        return {
            text: requireString(clue.text, `Clue ${index + 1} text`, {
                max: 500,
            }),
            points: parseNumber(clue.points, `Clue ${index + 1} points`, {
                min: 0,
            }),
        };
    });

    if (normalized.length < 2) {
        throw new AdminInputError("At least two clues are required");
    }

    return normalized;
};

/* =========================
   ADD
========================= */

// POST — multipart/form-data (champ fichier facultatif : "image")
export const addFigureChallenge = async (req, res, next) => {
    let uploadedImage = null;

    try {
        const body = req.body ?? {};

        const title = requireString(body.title, "Title", { min: 2, max: 150 });
        const answer = requireString(body.answer, "Answer", { max: 150 });
        const acceptedAnswers = parseStringArray(
            body.acceptedAnswers,
            "Accepted answers"
        );
        const clues = parseClues(body.clues);
        const explanation = optionalString(body.explanation, "Explanation", {
            max: 2000,
        });
        const historicalContext = optionalString(
            body.historicalContext,
            "Historical context",
            { max: 500 }
        );
        const difficulty = parseEnum(
            body.difficulty,
            DIFFICULTIES,
            "Difficulty",
            "Easy"
        );
        const tags = parseStringArray(body.tags, "Tags");
        const status = parseEnum(body.status, STATUSES, "Status", "draft");

        const slug = await generateUniqueSlug(FigureChallenge, title);

        // Upload uniquement une fois tout validé
        if (req.file) {
            uploadedImage = await uploadImage(req.file, IMAGE_FOLDER);
        }

        const challenge = await FigureChallenge.create({
            title,
            slug,
            answer,
            acceptedAnswers,
            image: uploadedImage
                ? {
                      url: uploadedImage.url,
                      publicId: uploadedImage.publicId,
                  }
                : EMPTY_IMAGE,
            clues,
            explanation,
            historicalContext,
            difficulty,
            tags,
            status,
        });

        return res.status(201).json({
            success: true,
            message: "Figure challenge created successfully",
            data: challenge,
        });
    } catch (err) {
        // Évite une image orpheline si la création échoue
        await safeDeleteImage(uploadedImage?.publicId);
        return handleAdminError(err, res, next);
    }
};

/* =========================
   UPDATE
========================= */

// PUT — modification partielle : seuls les champs envoyés sont modifiés.
// Image : nouveau fichier "image" pour remplacer, ou removeImage=true pour la retirer.
export const updateFigureChallenge = async (req, res, next) => {
    let newUploadedImage = null;

    try {
        const { id } = req.params;
        assertValidId(id, "figure challenge ID");

        const existing = await FigureChallenge.findById(id);

        if (!existing) {
            throw new AdminInputError("Figure challenge not found", 404);
        }

        const body = req.body ?? {};
        const updates = {};

        if (body.title !== undefined) {
            updates.title = requireString(body.title, "Title", {
                min: 2,
                max: 150,
            });
        }

        if (body.answer !== undefined) {
            updates.answer = requireString(body.answer, "Answer", {
                max: 150,
            });
        }

        if (body.acceptedAnswers !== undefined) {
            updates.acceptedAnswers = parseStringArray(
                body.acceptedAnswers,
                "Accepted answers"
            );
        }

        if (body.clues !== undefined) {
            updates.clues = parseClues(body.clues);
        }

        if (body.explanation !== undefined) {
            updates.explanation = optionalString(
                body.explanation,
                "Explanation",
                { max: 2000 }
            );
        }

        if (body.historicalContext !== undefined) {
            updates.historicalContext = optionalString(
                body.historicalContext,
                "Historical context",
                { max: 500 }
            );
        }

        if (body.difficulty !== undefined) {
            updates.difficulty = parseEnum(
                body.difficulty,
                DIFFICULTIES,
                "Difficulty"
            );
        }

        if (body.tags !== undefined) {
            updates.tags = parseStringArray(body.tags, "Tags");
        }

        if (body.status !== undefined) {
            updates.status = parseEnum(body.status, STATUSES, "Status");
        }

        const removeImage =
            body.removeImage === true || body.removeImage === "true";

        if (req.file) {
            newUploadedImage = await uploadImage(req.file, IMAGE_FOLDER);

            updates.image = {
                url: newUploadedImage.url,
                publicId: newUploadedImage.publicId,
            };
        } else if (removeImage) {
            updates.image = EMPTY_IMAGE;
        }

        if (Object.keys(updates).length === 0) {
            throw new AdminInputError("No modifications provided");
        }

        const updated = await FigureChallenge.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!updated) {
            throw new AdminInputError("Figure challenge not found", 404);
        }

        // Ancienne image supprimée seulement après la réussite de la mise à jour
        if (newUploadedImage || removeImage) {
            await safeDeleteImage(existing.image?.publicId);
        }

        return res.status(200).json({
            success: true,
            message: "Figure challenge updated successfully",
            data: updated,
        });
    } catch (err) {
        await safeDeleteImage(newUploadedImage?.publicId);
        return handleAdminError(err, res, next);
    }
};

/* =========================
   DELETE
========================= */

export const deleteFigureChallenge = async (req, res, next) => {
    try {
        const { id } = req.params;
        assertValidId(id, "figure challenge ID");

        const existing = await FigureChallenge.findById(id);

        if (!existing) {
            throw new AdminInputError("Figure challenge not found", 404);
        }

        // Document d'abord, image ensuite : si la BDD échoue, l'image reste valide.
        await FigureChallenge.findByIdAndDelete(id);
        await safeDeleteImage(existing.image?.publicId);

        return res.status(200).json({
            success: true,
            message: "Figure challenge deleted successfully",
        });
    } catch (err) {
        return handleAdminError(err, res, next);
    }
};
