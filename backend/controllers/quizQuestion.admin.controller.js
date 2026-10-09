
import mongoose from "mongoose";

import QuizQuestion from "../models/quizQuestion.model.js";
import HistoricalEra from "../models/historicalEra.model.js";
import Quiz from "../models/quiz.model.js";
import QuizAttempt from "../models/quizAttempt.js";

// ============================================================
// HELPERS
// ============================================================

const parseArray = (value, fieldName) => {
    if (value === undefined) return undefined;
    if (value === null || value === "") return [];

    let result = value;

    if (typeof value === "string") {
        try {
            result = JSON.parse(value);
        } catch {
            throw new Error(`${fieldName} must be a valid JSON array`);
        }
    }

    if (!Array.isArray(result)) {
        throw new Error(`${fieldName} must be an array`);
    }

    return result;
};

const normalizeOptions = (value) => {
    const options = parseArray(value, "options");

    if (!options || options.length !== 4) {
        throw new Error("A question must have exactly four options");
    }

    if (
        !options.every(
            (option) =>
                typeof option === "string" && option.trim().length > 0
        )
    ) {
        throw new Error("All four options must be non-empty strings");
    }

    const normalized = options.map((option) => option.trim());
    const unique = new Set(normalized.map((option) => option.toLowerCase()));

    if (unique.size !== 4) {
        throw new Error("Answer options must be unique");
    }

    return normalized;
};

const normalizeTags = (value) => {
    const tags = parseArray(value, "tags");

    if (!tags) return [];

    if (!tags.every((tag) => typeof tag === "string")) {
        throw new Error("Every tag must be a string");
    }

    return [
        ...new Set(
            tags.map((tag) => tag.trim()).filter(Boolean)
        ),
    ];
};

const validateEra = async (eraId) => {
    if (
        typeof eraId !== "string" ||
        !mongoose.isValidObjectId(eraId)
    ) {
        throw new Error("Invalid historical era ID");
    }

    const exists = await HistoricalEra.exists({ _id: eraId });

    if (!exists) {
        throw new Error("Historical era does not exist");
    }
};

const validateCorrectAnswerIndex = (value) => {
    const index = Number(value);

    if (!Number.isInteger(index) || index < 0 || index > 3) {
        throw new Error("Correct answer index must be an integer from 0 to 3");
    }

    return index;
};

const handleError = (res, error) => {
    if (error.name === "ValidationError" || error.name === "CastError") {
        res.status(400).json({
            success: false,
            message: error.message,
        });

        return true;
    }

    return false;
};

// ============================================================
// CREATE QUESTION
// POST /api/v1/admin/quiz-questions
// ============================================================

export const addQuizQuestion = async (req, res, next) => {
    try {
        const {
            questionText,
            options,
            correctAnswerIndex,
            explanation,
            era,
            difficulty,
            source,
            tags,
            status,
        } = req.body;

        if (
            typeof questionText !== "string" ||
            questionText.trim().length < 10
        ) {
            return res.status(400).json({
                success: false,
                message: "Question text must contain at least 10 characters",
            });
        }

        let normalizedOptions;
        let normalizedIndex;
        let normalizedTags;

        try {
            normalizedOptions = normalizeOptions(options);
            normalizedIndex = validateCorrectAnswerIndex(correctAnswerIndex);
            normalizedTags = normalizeTags(tags);
            await validateEra(era);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        const question = await QuizQuestion.create({
            questionText: questionText.trim(),
            options: normalizedOptions,
            correctAnswerIndex: normalizedIndex,
            explanation: explanation ?? "",
            era,
            difficulty: difficulty ?? "Easy",
            source: source ?? "",
            tags: normalizedTags,
            status: status ?? "draft",
        });

        const createdQuestion = await QuizQuestion.findById(question._id)
            .populate("era", "name startYear endYear");

        return res.status(201).json({
            success: true,
            message: "Quiz question created successfully",
            data: createdQuestion,
        });
    } catch (error) {
        if (handleError(res, error)) return;
        next(error);
    }
};

// ============================================================
// UPDATE QUESTION
// PUT /api/v1/admin/quiz-questions/:id
// ============================================================

export const updateQuizQuestion = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid question ID",
            });
        }

        const question = await QuizQuestion.findById(id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Quiz question not found",
            });
        }

        const {
            questionText,
            options,
            correctAnswerIndex,
            explanation,
            era,
            difficulty,
            source,
            tags,
            status,
        } = req.body;

        const updates = {};

        if (questionText !== undefined) {
            if (
                typeof questionText !== "string" ||
                questionText.trim().length < 10
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Question text must contain at least 10 characters",
                });
            }

            updates.questionText = questionText.trim();
        }

        if (options !== undefined) {
            try {
                updates.options = normalizeOptions(options);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
        }

        if (correctAnswerIndex !== undefined) {
            try {
                updates.correctAnswerIndex =
                    validateCorrectAnswerIndex(correctAnswerIndex);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
        }

        if (era !== undefined) {
            try {
                await validateEra(era);
                updates.era = era;
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
        }

        if (explanation !== undefined) {
            if (typeof explanation !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Explanation must be a string",
                });
            }

            updates.explanation = explanation.trim();
        }

        if (source !== undefined) {
            if (typeof source !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Source must be a string",
                });
            }

            updates.source = source.trim();
        }

        if (tags !== undefined) {
            try {
                updates.tags = normalizeTags(tags);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
        }

        if (difficulty !== undefined) {
            updates.difficulty = difficulty;
        }

        if (status !== undefined) {
            updates.status = status;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No modifications provided",
            });
        }

        Object.assign(question, updates);
        await question.save();

        const updatedQuestion = await QuizQuestion.findById(question._id)
            .populate("era", "name startYear endYear");

        return res.status(200).json({
            success: true,
            message: "Quiz question updated successfully",
            data: updatedQuestion,
        });
    } catch (error) {
        if (handleError(res, error)) return;
        next(error);
    }
};

// ============================================================
// DELETE QUESTION
// DELETE /api/v1/admin/quiz-questions/:id
// ============================================================

export const deleteQuizQuestion = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid question ID",
            });
        }

        const question = await QuizQuestion.findById(id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Quiz question not found",
            });
        }

        const [usedByQuiz, usedByAttempt] = await Promise.all([
            Quiz.exists({ "questions.question": id }),
            QuizAttempt.exists({ "answers.question": id }),
        ]);

        if (usedByQuiz || usedByAttempt) {
            return res.status(409).json({
                success: false,
                message:
                    "This question is linked to a quiz or an attempt. Remove its quiz references first, or archive it instead.",
            });
        }

        await QuizQuestion.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Quiz question deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};