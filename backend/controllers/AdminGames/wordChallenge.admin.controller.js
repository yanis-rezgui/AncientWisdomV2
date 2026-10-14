import WordChallenge from "../../models/Games/wordChallenge.model.js";
import {
    DIFFICULTIES,
    STATUSES,
    AdminInputError,
    assertValidId,
    generateUniqueSlug,
    handleAdminError,
    optionalString,
    parseEnum,
    parseNumber,
    requireString,
} from "../../utils/challengeAdmin.helpers.js";

const CATEGORIES = [
    "figure",
    "event",
    "place",
    "civilization",
    "era",
    "artifact",
    "other",
];

/* =========================
   SCRAMBLE HELPERS
========================= */

// Les espaces ne sont pas à placer côté joueur : on les ignore.
const stripSpaces = (text) => text.replace(/\s/g, "");

// Deux textes ont les mêmes lettres si, triées, elles sont identiques.
const lettersKey = (text) =>
    stripSpaces(text).toLowerCase().split("").sort().join("");

// Mélange les lettres de la réponse en garantissant un résultat différent.
const generateScramble = (answer) => {
    const letters = stripSpaces(answer).split("");
    const original = letters.join("").toLowerCase();

    // Moins de deux lettres différentes : impossible de mélanger
    if (new Set(letters.map((letter) => letter.toLowerCase())).size < 2) {
        return letters.join("");
    }

    for (let attempt = 0; attempt < 50; attempt++) {
        const shuffled = [...letters];

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        if (shuffled.join("").toLowerCase() !== original) {
            return shuffled.join("");
        }
    }

    // Repli : une rotation d'une lettre diffère toujours si les lettres ne sont pas toutes identiques
    return letters.slice(1).concat(letters[0]).join("");
};

const assertSameLetters = (scrambledLetters, answer) => {
    if (lettersKey(scrambledLetters) !== lettersKey(answer)) {
        throw new AdminInputError(
            "Scrambled letters must contain exactly the same letters as the answer"
        );
    }
};

/* =========================
   ADD
========================= */

// POST — JSON. scrambledLetters est facultatif : généré automatiquement s'il est absent.
export const addWordChallenge = async (req, res, next) => {
    try {
        const body = req.body ?? {};

        const title = requireString(body.title, "Title", { max: 150 });
        const answer = requireString(body.answer, "Answer", { max: 100 });

        let scrambledLetters;

        if (
            body.scrambledLetters === undefined ||
            body.scrambledLetters === ""
        ) {
            scrambledLetters = generateScramble(answer);
        } else {
            scrambledLetters = requireString(
                body.scrambledLetters,
                "Scrambled letters",
                { max: 100 }
            );
            assertSameLetters(scrambledLetters, answer);
        }

        const hint = optionalString(body.hint, "Hint", { max: 500 });
        const explanation = optionalString(body.explanation, "Explanation", {
            max: 1000,
        });
        const category = parseEnum(
            body.category,
            CATEGORIES,
            "Category",
            "other"
        );
        const difficulty = parseEnum(
            body.difficulty,
            DIFFICULTIES,
            "Difficulty",
            "Easy"
        );
        const points =
            body.points === undefined
                ? 10
                : parseNumber(body.points, "Points", {
                      min: 1,
                      integer: true,
                  });
        const status = parseEnum(body.status, STATUSES, "Status", "draft");

        const slug = await generateUniqueSlug(WordChallenge, title);

        const challenge = await WordChallenge.create({
            title,
            slug,
            answer,
            scrambledLetters,
            hint,
            explanation,
            category,
            difficulty,
            points,
            status,
        });

        return res.status(201).json({
            success: true,
            message: "Word challenge created successfully",
            data: challenge,
        });
    } catch (err) {
        return handleAdminError(err, res, next);
    }
};

/* =========================
   UPDATE
========================= */

// PUT — modification partielle.
// Si la réponse change sans nouvelles lettres, le mélange est régénéré.
// Si regenerateScramble=true, un nouveau mélange est généré.
export const updateWordChallenge = async (req, res, next) => {
    try {
        const { id } = req.params;
        assertValidId(id, "word challenge ID");

        const existing = await WordChallenge.findById(id);

        if (!existing) {
            throw new AdminInputError("Word challenge not found", 404);
        }

        const body = req.body ?? {};
        const updates = {};

        if (body.title !== undefined) {
            updates.title = requireString(body.title, "Title", { max: 150 });
        }

        if (body.answer !== undefined) {
            updates.answer = requireString(body.answer, "Answer", {
                max: 100,
            });
        }

        const finalAnswer = updates.answer ?? existing.answer;
        const regenerate =
            body.regenerateScramble === true ||
            body.regenerateScramble === "true";

        if (
            body.scrambledLetters !== undefined &&
            body.scrambledLetters !== ""
        ) {
            updates.scrambledLetters = requireString(
                body.scrambledLetters,
                "Scrambled letters",
                { max: 100 }
            );
            assertSameLetters(updates.scrambledLetters, finalAnswer);
        } else if (updates.answer !== undefined || regenerate) {
            updates.scrambledLetters = generateScramble(finalAnswer);
        }

        if (body.hint !== undefined) {
            updates.hint = optionalString(body.hint, "Hint", { max: 500 });
        }

        if (body.explanation !== undefined) {
            updates.explanation = optionalString(
                body.explanation,
                "Explanation",
                { max: 1000 }
            );
        }

        if (body.category !== undefined) {
            updates.category = parseEnum(
                body.category,
                CATEGORIES,
                "Category"
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

        const updated = await WordChallenge.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!updated) {
            throw new AdminInputError("Word challenge not found", 404);
        }

        return res.status(200).json({
            success: true,
            message: "Word challenge updated successfully",
            data: updated,
        });
    } catch (err) {
        return handleAdminError(err, res, next);
    }
};

/* =========================
   DELETE
========================= */

export const deleteWordChallenge = async (req, res, next) => {
    try {
        const { id } = req.params;
        assertValidId(id, "word challenge ID");

        const deleted = await WordChallenge.findByIdAndDelete(id);

        if (!deleted) {
            throw new AdminInputError("Word challenge not found", 404);
        }

        return res.status(200).json({
            success: true,
            message: "Word challenge deleted successfully",
        });
    } catch (err) {
        return handleAdminError(err, res, next);
    }
};
