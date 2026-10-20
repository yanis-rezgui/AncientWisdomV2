import LandmarkChallenge from "../../models/Games/landmarkChallenge.model.js";
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
    parseStringArray,
    requireString,
    safeDeleteImage,
} from "../../utils/challengeAdmin.helpers.js";

const IMAGE_FOLDER = "Ancient-Wisdom/games/landmark-challenges";

/* =========================
   PARSERS
========================= */

// Exactement 4 options non vides et uniques (insensible à la casse)
const parseOptions = (options) => {
    const items = parseArray(options, "Options");

    if (
        items.length !== 4 ||
        !items.every((item) => typeof item === "string" && item.trim() !== "")
    ) {
        throw new AdminInputError("Exactly four non-empty options are required");
    }

    const cleaned = items.map((item) => item.trim());

    if (new Set(cleaned.map((item) => item.toLowerCase())).size !== 4) {
        throw new AdminInputError("Options must be unique");
    }

    return cleaned;
};

// La bonne réponse doit être l'une des 4 options.
// On renvoie l'option telle qu'elle est écrite pour que la comparaison reste exacte.
const resolveAnswer = (answer, options) => {
    const match = options.find(
        (option) => option.toLowerCase() === answer.toLowerCase()
    );

    if (!match) {
        throw new AdminInputError("The answer must be one of the four options");
    }

    return match;
};

/* =========================
   ADD
========================= */

// POST — multipart/form-data (champ fichier obligatoire : "image")
export const addLandmarkChallenge = async (req, res, next) => {
    let uploadedImage = null;

    try {
        const body = req.body ?? {};

        const title = requireString(body.title, "Title", { max: 150 });
        const options = parseOptions(body.options);
        const answer = resolveAnswer(
            requireString(body.answer, "Answer", { max: 200 }),
            options
        );
        const hint = optionalString(body.hint, "Hint", { max: 500 });
        const explanation = optionalString(body.explanation, "Explanation", {
            max: 2000,
        });
        const location = optionalString(body.location, "Location", {
            max: 200,
        });
        const civilization = optionalString(
            body.civilization,
            "Civilization",
            { max: 150 }
        );
        const difficulty = parseEnum(
            body.difficulty,
            DIFFICULTIES,
            "Difficulty",
            "Easy"
        );
        const tags = parseStringArray(body.tags, "Tags");
        const status = parseEnum(body.status, STATUSES, "Status", "draft");

        if (!req.file) {
            throw new AdminInputError("Landmark image is required");
        }

        const slug = await generateUniqueSlug(LandmarkChallenge, title);

        uploadedImage = await uploadImage(req.file, IMAGE_FOLDER);

        const challenge = await LandmarkChallenge.create({
            title,
            slug,
            image: {
                url: uploadedImage.url,
                publicId: uploadedImage.publicId,
            },
            answer,
            options,
            hint,
            explanation,
            location,
            civilization,
            difficulty,
            tags,
            status,
        });

     await notifyAdmins({
    title: "New Challenge Created",
    message: `A new challenge, "${challenge.title}", has been created on Ancient Wisdom.`,
    type: "NEW_CHALLENGE",
});
        return res.status(201).json({
            success: true,
            message: "Landmark challenge created successfully",
            data: challenge,
        });
    } catch (err) {
        await safeDeleteImage(uploadedImage?.publicId);
        return handleAdminError(err, res, next);
    }
};

/* =========================
   UPDATE
========================= */

// PUT — modification partielle (nouveau fichier "image" pour remplacer l'image)
export const updateLandmarkChallenge = async (req, res, next) => {
    let newUploadedImage = null;

    try {
        const { id } = req.params;
        assertValidId(id, "landmark challenge ID");

        const existing = await LandmarkChallenge.findById(id);

        if (!existing) {
            throw new AdminInputError("Landmark challenge not found", 404);
        }

        const body = req.body ?? {};
        const updates = {};

        if (body.title !== undefined) {
            updates.title = requireString(body.title, "Title", { max: 150 });
        }

        if (body.options !== undefined) {
            updates.options = parseOptions(body.options);
        }

        if (body.answer !== undefined) {
            updates.answer = requireString(body.answer, "Answer", {
                max: 200,
            });
        }

        // La réponse doit toujours rester cohérente avec les options finales
        if (updates.options || updates.answer) {
            updates.answer = resolveAnswer(
                updates.answer ?? existing.answer,
                updates.options ?? [...existing.options]
            );
        }

        if (body.hint !== undefined) {
            updates.hint = optionalString(body.hint, "Hint", { max: 500 });
        }

        if (body.explanation !== undefined) {
            updates.explanation = optionalString(
                body.explanation,
                "Explanation",
                { max: 2000 }
            );
        }

        if (body.location !== undefined) {
            updates.location = optionalString(body.location, "Location", {
                max: 200,
            });
        }

        if (body.civilization !== undefined) {
            updates.civilization = optionalString(
                body.civilization,
                "Civilization",
                { max: 150 }
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

        if (req.file) {
            newUploadedImage = await uploadImage(req.file, IMAGE_FOLDER);

            updates.image = {
                url: newUploadedImage.url,
                publicId: newUploadedImage.publicId,
            };
        }

        if (Object.keys(updates).length === 0) {
            throw new AdminInputError("No modifications provided");
        }

        const updated = await LandmarkChallenge.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!updated) {
            throw new AdminInputError("Landmark challenge not found", 404);
        }

        if (newUploadedImage) {
            await safeDeleteImage(existing.image?.publicId);
        }

        return res.status(200).json({
            success: true,
            message: "Landmark challenge updated successfully",
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

export const deleteLandmarkChallenge = async (req, res, next) => {
    try {
        const { id } = req.params;
        assertValidId(id, "landmark challenge ID");

        const existing = await LandmarkChallenge.findById(id);

        if (!existing) {
            throw new AdminInputError("Landmark challenge not found", 404);
        }

        await LandmarkChallenge.findByIdAndDelete(id);
        await safeDeleteImage(existing.image?.publicId);

        return res.status(200).json({
            success: true,
            message: "Landmark challenge deleted successfully",
        });
    } catch (err) {
        return handleAdminError(err, res, next);
    }
};
