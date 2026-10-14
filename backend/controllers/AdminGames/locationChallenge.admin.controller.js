import LocationChallenge from "../../models/Games/locationChallenge.model.js";
import {
    DIFFICULTIES,
    STATUSES,
    AdminInputError,
    assertValidId,
    generateUniqueSlug,
    handleAdminError,
    optionalString,
    parseEnum,
    parseJson,
    parseNumber,
    requireString,
} from "../../utils/challengeAdmin.helpers.js";

/* =========================
   PARSERS
========================= */

// Accepte { coordinates: { latitude, longitude } } ou latitude / longitude à plat.
// Retourne undefined si rien n'est envoyé.
const readCoordinates = (body) => {
    const raw =
        body.coordinates ??
        (body.latitude !== undefined || body.longitude !== undefined
            ? { latitude: body.latitude, longitude: body.longitude }
            : undefined);

    if (raw === undefined) return undefined;

    const coordinates = parseJson(raw, "Coordinates");

    if (!coordinates || typeof coordinates !== "object") {
        throw new AdminInputError(
            "Coordinates must contain a latitude and a longitude"
        );
    }

    return {
        latitude: parseNumber(coordinates.latitude, "Latitude", {
            min: -90,
            max: 90,
        }),
        longitude: parseNumber(coordinates.longitude, "Longitude", {
            min: -180,
            max: 180,
        }),
    };
};

/* =========================
   ADD
========================= */

// POST — JSON (pas d'image pour ce jeu)
export const addLocationChallenge = async (req, res, next) => {
    try {
        const body = req.body ?? {};

        const title = requireString(body.title, "Title", { max: 150 });
        const question = requireString(body.question, "Question", {
            max: 500,
        });
        const answer = requireString(body.answer, "Answer", { max: 200 });

        const coordinates = readCoordinates(body);

        if (!coordinates) {
            throw new AdminInputError("Coordinates are required");
        }

        const mapZoom =
            body.mapZoom === undefined
                ? 4
                : parseNumber(body.mapZoom, "Map zoom", {
                      min: 1,
                      max: 18,
                      integer: true,
                  });

        const hint = optionalString(body.hint, "Hint", { max: 500 });
        const explanation = optionalString(body.explanation, "Explanation", {
            max: 2000,
        });
        const difficulty = parseEnum(
            body.difficulty,
            DIFFICULTIES,
            "Difficulty",
            "Easy"
        );
        const points =
            body.points === undefined
                ? 100
                : parseNumber(body.points, "Points", {
                      min: 1,
                      integer: true,
                  });
        const status = parseEnum(body.status, STATUSES, "Status", "draft");

        const slug = await generateUniqueSlug(LocationChallenge, title);

        const challenge = await LocationChallenge.create({
            title,
            slug,
            question,
            answer,
            coordinates,
            mapZoom,
            hint,
            explanation,
            difficulty,
            points,
            status,
        });

        return res.status(201).json({
            success: true,
            message: "Location challenge created successfully",
            data: challenge,
        });
    } catch (err) {
        return handleAdminError(err, res, next);
    }
};

/* =========================
   UPDATE
========================= */

// PUT — modification partielle : seuls les champs envoyés sont modifiés
export const updateLocationChallenge = async (req, res, next) => {
    try {
        const { id } = req.params;
        assertValidId(id, "location challenge ID");

        const existing = await LocationChallenge.findById(id).select("_id");

        if (!existing) {
            throw new AdminInputError("Location challenge not found", 404);
        }

        const body = req.body ?? {};
        const updates = {};

        if (body.title !== undefined) {
            updates.title = requireString(body.title, "Title", { max: 150 });
        }

        if (body.question !== undefined) {
            updates.question = requireString(body.question, "Question", {
                max: 500,
            });
        }

        if (body.answer !== undefined) {
            updates.answer = requireString(body.answer, "Answer", {
                max: 200,
            });
        }

        const coordinates = readCoordinates(body);

        if (coordinates) {
            updates.coordinates = coordinates;
        }

        if (body.mapZoom !== undefined) {
            updates.mapZoom = parseNumber(body.mapZoom, "Map zoom", {
                min: 1,
                max: 18,
                integer: true,
            });
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

        if (body.difficulty !== undefined) {
            updates.difficulty = parseEnum(
                body.difficulty,
                DIFFICULTIES,
                "Difficulty"
            );
        }

        if (body.points !== undefined) {
            updates.points = parseNumber(body.points, "Points", {
                min: 1,
                integer: true,
            });
        }

        if (body.status !== undefined) {
            updates.status = parseEnum(body.status, STATUSES, "Status");
        }

        if (Object.keys(updates).length === 0) {
            throw new AdminInputError("No modifications provided");
        }

        const updated = await LocationChallenge.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!updated) {
            throw new AdminInputError("Location challenge not found", 404);
        }

        return res.status(200).json({
            success: true,
            message: "Location challenge updated successfully",
            data: updated,
        });
    } catch (err) {
        return handleAdminError(err, res, next);
    }
};

/* =========================
   DELETE
========================= */

export const deleteLocationChallenge = async (req, res, next) => {
    try {
        const { id } = req.params;
        assertValidId(id, "location challenge ID");

        const deleted = await LocationChallenge.findByIdAndDelete(id);

        if (!deleted) {
            throw new AdminInputError("Location challenge not found", 404);
        }

        return res.status(200).json({
            success: true,
            message: "Location challenge deleted successfully",
        });
    } catch (err) {
        return handleAdminError(err, res, next);
    }
};
