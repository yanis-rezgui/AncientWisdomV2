
import mongoose from "mongoose";

import Quiz from "../models/quiz.model.js";
import QuizQuestion from "../models/quizQuestion.model.js";
import HistoricalEra from "../models/historicalEra.model.js";
import QuizAttempt from "../models/quizAttempt.js";

// ============================================================
// HELPERS
// ============================================================

const slugify = (value) =>
    value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

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

const validateObjectIds = (ids, fieldName) => {
    if (
        !ids.every(
            (id) =>
                typeof id === "string" &&
                mongoose.isValidObjectId(id)
        )
    ) {
        throw new Error(`${fieldName} contains an invalid ID`);
    }

    if (new Set(ids.map(String)).size !== ids.length) {
        throw new Error(`${fieldName} cannot contain duplicates`);
    }
};

const validateEras = async (eraIds) => {
    validateObjectIds(eraIds, "eras");

    const count = await HistoricalEra.countDocuments({
        _id: { $in: eraIds },
    });

    if (count !== eraIds.length) {
        throw new Error("One or more historical eras do not exist");
    }
};

const normalizeQuizQuestions = async (questions) => {
    if (!Array.isArray(questions)) {
        throw new Error("Questions must be an array");
    }

    const normalized = questions.map((item) => {
        if (!item || typeof item !== "object") {
            throw new Error("Each quiz question must be an object");
        }

        const { question, order, points = 1 } = item;

        if (
            typeof question !== "string" ||
            !mongoose.isValidObjectId(question)
        ) {
            throw new Error("Invalid question ID");
        }

        if (!Number.isInteger(order) || order < 1) {
            throw new Error("Question order must be a positive integer");
        }

        if (!Number.isInteger(points) || points < 1) {
            throw new Error("Question points must be a positive integer");
        }

        return { question, order, points };
    });

    validateObjectIds(
        normalized.map((item) => item.question),
        "questions"
    );

    const orders = normalized.map((item) => item.order);

    if (new Set(orders).size !== orders.length) {
        throw new Error("Question orders must be unique");
    }

    const count = await QuizQuestion.countDocuments({
        _id: { $in: normalized.map((item) => item.question) },
    });

    if (count !== normalized.length) {
        throw new Error("One or more quiz questions do not exist");
    }

    return normalized;
};

const sendError = (res, error) => {
    if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "A quiz with this slug already exists",
        });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }

    return null;
};

// ============================================================
// GET ALL QUIZZES — ADMIN
// GET /api/v1/admin/quizzes
// ============================================================

export const getAdminQuizzes = async (req, res, next) => {
    try {
        const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
        const limit = Math.min(
            100,
            Math.max(1, Number.parseInt(req.query.limit, 10) || 20)
        );

        const filter = {};

        // No status filter means ALL statuses.
        if (req.query.status !== undefined) {
            if (!["draft", "published", "archived"].includes(req.query.status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid quiz status",
                });
            }

            filter.status = req.query.status;
        }

        if (req.query.difficulty !== undefined) {
            if (!["Easy", "Medium", "Hard"].includes(req.query.difficulty)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid quiz difficulty",
                });
            }

            filter.difficulty = req.query.difficulty;
        }

        if (typeof req.query.search === "string" && req.query.search.trim()) {
            const escapedSearch = req.query.search
                .trim()
                .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            filter.$or = [
                { title: { $regex: escapedSearch, $options: "i" } },
                { description: { $regex: escapedSearch, $options: "i" } },
                { slug: { $regex: escapedSearch, $options: "i" } },
            ];
        }

        const [quizzes, total] = await Promise.all([
            Quiz.find(filter)
                .populate("eras", "name startYear endYear")
                .populate({
                    path: "questions.question",
                    select: "questionText difficulty status era",
                    populate: {
                        path: "era",
                        select: "name",
                    },
                })
                .sort({ updatedAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),

            Quiz.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            data: quizzes,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

// ============================================================
// CREATE QUIZ
// POST /api/v1/admin/quizzes
// ============================================================

export const addQuiz = async (req, res, next) => {
    try {
        const {
            title,
            description,
            slug,
            eras,
            questions,
            difficulty,
            timeLimit,
            status,
        } = req.body;

        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Quiz title is required",
            });
        }

        if (typeof description !== "string" || !description.trim()) {
            return res.status(400).json({
                success: false,
                message: "Quiz description is required",
            });
        }

        let eraIds;
        let quizQuestions;

        try {
            eraIds = parseArray(eras, "eras") ?? [];
            quizQuestions = parseArray(questions, "questions") ?? [];

            await validateEras(eraIds);
            quizQuestions = await normalizeQuizQuestions(quizQuestions);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        const normalizedStatus = status ?? "draft";

        if (!["draft", "published", "archived"].includes(normalizedStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid quiz status",
            });
        }

        if (normalizedStatus === "published" && quizQuestions.length === 0) {
            return res.status(400).json({
                success: false,
                message: "A published quiz must contain at least one question",
            });
        }

        let normalizedTimeLimit = null;

        if (timeLimit !== undefined && timeLimit !== null && timeLimit !== "") {
            normalizedTimeLimit = Number(timeLimit);

            if (!Number.isFinite(normalizedTimeLimit) || normalizedTimeLimit < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Time limit must be a positive number or null",
                });
            }
        }

        const normalizedSlug = slugify(
            typeof slug === "string" && slug.trim() ? slug : title
        );

        const quiz = await Quiz.create({
            title: title.trim(),
            description: description.trim(),
            slug: normalizedSlug,
            eras: eraIds,
            questions: quizQuestions,
            difficulty: difficulty ?? "Medium",
            timeLimit: normalizedTimeLimit,
            status: normalizedStatus,
        });

        const createdQuiz = await Quiz.findById(quiz._id)
            .populate("eras", "name startYear endYear")
            .populate("questions.question", "questionText difficulty status");

        return res.status(201).json({
            success: true,
            message: "Quiz created successfully",
            data: createdQuiz,
        });
    } catch (error) {
        if (sendError(res, error)) return;
        next(error);
    }
};

// ============================================================
// UPDATE QUIZ
// PUT /api/v1/admin/quizzes/:id
// ============================================================

export const updateQuiz = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid quiz ID",
            });
        }

        const quiz = await Quiz.findById(id);

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found",
            });
        }

        const {
            title,
            description,
            slug,
            eras,
            questions,
            difficulty,
            timeLimit,
            status,
        } = req.body;

        const updates = {};

        if (title !== undefined) {
            if (typeof title !== "string" || !title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Quiz title is invalid",
                });
            }

            updates.title = title.trim();

            if (slug === undefined) {
                updates.slug = slugify(title);
            }
        }

        if (slug !== undefined) {
            if (typeof slug !== "string" || !slug.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Quiz slug is invalid",
                });
            }

            updates.slug = slugify(slug);
        }

        if (description !== undefined) {
            if (typeof description !== "string" || !description.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Quiz description is invalid",
                });
            }

            updates.description = description.trim();
        }

        if (eras !== undefined) {
            try {
                updates.eras = parseArray(eras, "eras");
                await validateEras(updates.eras);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
        }

        if (questions !== undefined) {
            try {
                const parsedQuestions = parseArray(questions, "questions");
                updates.questions = await normalizeQuizQuestions(parsedQuestions);
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

        if (timeLimit !== undefined) {
            if (timeLimit === null || timeLimit === "") {
                updates.timeLimit = null;
            } else {
                const value = Number(timeLimit);

                if (!Number.isFinite(value) || value < 1) {
                    return res.status(400).json({
                        success: false,
                        message: "Time limit must be a positive number or null",
                    });
                }

                updates.timeLimit = value;
            }
        }

        if (status !== undefined) {
            if (!["draft", "published", "archived"].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid quiz status",
                });
            }

            updates.status = status;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No modifications provided",
            });
        }

        const finalStatus = updates.status ?? quiz.status;
        const finalQuestions = updates.questions ?? quiz.questions;

        if (finalStatus === "published" && finalQuestions.length === 0) {
            return res.status(400).json({
                success: false,
                message: "A published quiz must contain at least one question",
            });
        }

        Object.assign(quiz, updates);

        // Document.save() runs schema validation.
        await quiz.save();

        const updatedQuiz = await Quiz.findById(quiz._id)
            .populate("eras", "name startYear endYear")
            .populate("questions.question", "questionText difficulty status");

        return res.status(200).json({
            success: true,
            message: "Quiz updated successfully",
            data: updatedQuiz,
        });
    } catch (error) {
        if (sendError(res, error)) return;
        next(error);
    }
};

// ============================================================
// DELETE QUIZ
// DELETE /api/v1/admin/quizzes/:id
// ============================================================

export const deleteQuiz = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid quiz ID",
            });
        }

        const quiz = await Quiz.findById(id);

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found",
            });
        }

        // Preserve historical attempts and their references.
        const hasAttempts = await QuizAttempt.exists({ quiz: id });

        if (hasAttempts) {
            return res.status(409).json({
                success: false,
                message:
                    "This quiz has attempts and cannot be deleted. Archive it instead.",
            });
        }

        await Quiz.findByIdAndDelete(id);

        // Deliberately do not delete its questions:
        // they might be reused by another quiz.

        return res.status(200).json({
            success: true,
            message: "Quiz deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};