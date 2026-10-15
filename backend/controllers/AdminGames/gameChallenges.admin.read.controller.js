import FigureChallenge from "../../models/Games/figureChallenge.model.js";
import LandmarkChallenge from "../../models/Games/landmarkChallenge.model.js";
import LocationChallenge from "../../models/Games/locationChallenge.model.js";
import MemoryChallenge from "../../models/Games/memoryChallenge.model.js";
import WordChallenge from "../../models/Games/wordChallenge.model.js";
import {
    DIFFICULTIES,
    STATUSES,
    AdminInputError,
    assertValidId,
    handleAdminError,
} from "../../utils/challengeAdmin.helpers.js";

/* =========================
   GENERIC HANDLERS
========================= */

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Filtres admin : search (champs texte), status, difficulty.
// Contrairement à l'API publique, les brouillons et les réponses sont renvoyés.
const buildFilter = (query, searchFields) => {
    const filter = {};
    const { search, status, difficulty } = query;

    if (typeof status === "string" && STATUSES.includes(status)) {
        filter.status = status;
    }

    if (typeof difficulty === "string" && DIFFICULTIES.includes(difficulty)) {
        filter.difficulty = difficulty;
    }

    if (typeof search === "string" && search.trim() !== "") {
        const regex = new RegExp(escapeRegex(search.trim()), "i");
        filter.$or = searchFields.map((field) => ({ [field]: regex }));
    }

    return filter;
};

const listChallenges = (Model, searchFields) => async (req, res, next) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

        const filter = buildFilter(req.query, searchFields);

        const [challenges, total] = await Promise.all([
            Model.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Model.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            data: challenges,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        return handleAdminError(err, res, next);
    }
};

const getChallenge = (Model, label) => async (req, res, next) => {
    try {
        const { id } = req.params;
        assertValidId(id, `${label} ID`);

        const challenge = await Model.findById(id).lean();

        if (!challenge) {
            throw new AdminInputError(`${label} not found`, 404);
        }

        return res.status(200).json({ success: true, data: challenge });
    } catch (err) {
        return handleAdminError(err, res, next);
    }
};

/* =========================
   FIGURE
========================= */

export const getFigureChallenges = listChallenges(FigureChallenge, [
    "title",
    "answer",
    "tags",
]);
export const getFigureChallenge = getChallenge(
    FigureChallenge,
    "Figure challenge"
);

/* =========================
   LANDMARK
========================= */

export const getLandmarkChallenges = listChallenges(LandmarkChallenge, [
    "title",
    "answer",
    "location",
    "civilization",
    "tags",
]);
export const getLandmarkChallenge = getChallenge(
    LandmarkChallenge,
    "Landmark challenge"
);

/* =========================
   LOCATION
========================= */

export const getLocationChallenges = listChallenges(LocationChallenge, [
    "title",
    "question",
    "answer",
]);
export const getLocationChallenge = getChallenge(
    LocationChallenge,
    "Location challenge"
);

/* =========================
   MEMORY
========================= */

export const getMemoryChallenges = listChallenges(MemoryChallenge, ["title"]);
export const getMemoryChallenge = getChallenge(
    MemoryChallenge,
    "Memory challenge"
);

/* =========================
   WORD
========================= */

export const getWordChallenges = listChallenges(WordChallenge, [
    "title",
    "answer",
]);
export const getWordChallenge = getChallenge(WordChallenge, "Word challenge");
