import mongoose from "mongoose";
import Quiz from "../models/quiz.model.js";
import QuizAttempt from "../models/quizAttempt.js";
import QuizQuestion from "../models/quizQuestion.model.js";




// ============================================================
// HELPERS
// ============================================================

// Adapt this helper if your auth middleware uses another property.
const getUserId = (req) => {
    return req.user?._id || req.user?.id;
};


// ============================================================
// VALIDATE ID
// ============================================================

const isValidId = (id) => {
    return mongoose.isValidObjectId(id);
};


// ============================================================
// HIDE CORRECT ANSWERS
// ============================================================

const sanitizeAttempt = (attempt, revealAnswers = false) => {

    const data = attempt.toObject
        ? attempt.toObject()
        : attempt;

    data.answers = data.answers.map((answer) => {

        const sanitizedAnswer = { ...answer };

        if (!revealAnswers) {
            delete sanitizedAnswer.correctAnswerIndex;
            delete sanitizedAnswer.isCorrect;
            delete sanitizedAnswer.earnedPoints;
        }

        return sanitizedAnswer;
    });

    return data;
};


// ============================================================
// FINALIZE ATTEMPT
// ============================================================

const finalizeAttempt = async (attempt) => {

    let score = 0;

    for (const answer of attempt.answers) {

        const isAnswered =
            Number.isInteger(answer.selectedAnswerIndex);

        answer.isCorrect = isAnswered
            ? answer.selectedAnswerIndex ===
                answer.correctAnswerIndex
            : false;

        answer.earnedPoints = answer.isCorrect
            ? answer.points
            : 0;

        score += answer.earnedPoints;
    }

    attempt.score = score;
    attempt.percentage = attempt.maxScore > 0
        ? Math.round((score / attempt.maxScore) * 10000) / 100
        : 0;

    attempt.status = "completed";
    attempt.completedAt = new Date();

    attempt.durationSeconds = Math.max(
        0,
        Math.floor(
            (attempt.completedAt.getTime() -
                new Date(attempt.startedAt).getTime()) / 1000
        )
    );

    await attempt.save();

    return attempt;
};


// ============================================================
// CHECK TIME LIMIT
// ============================================================

const isTimeExpired = (attempt, timeLimitMinutes) => {

    if (timeLimitMinutes === null ||
        timeLimitMinutes === undefined) {
        return false;
    }

    const elapsedSeconds = (
        Date.now() - new Date(attempt.startedAt).getTime()
    ) / 1000;

    return elapsedSeconds >= timeLimitMinutes * 60;
};


// ============================================================
// GET PUBLISHED QUIZZES
// GET /api/v1/quizzes
// ============================================================

export const getQuizzes = async (req, res, next) => {

    try {

        const {
            search,
            difficulty,
            era,
            page = 1,
            limit = 10
        } = req.query;

        const filters = {
            status: "published"
        };

        if (
            typeof search === "string" &&
            search.trim() !== ""
        ) {

            filters.title = {
                $regex: search.trim(),
                $options: "i"
            };
        }

        if (
            typeof difficulty === "string" &&
            ["Easy", "Medium", "Hard"].includes(difficulty)
        ) {
            filters.difficulty = difficulty;
        }

        if (typeof era === "string" && era.trim() !== "") {

            if (!isValidId(era)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid historical era ID"
                });
            }

            filters.eras = era;
        }

        const pageNumber = Math.max(
            Number(page) || 1,
            1
        );

        const limitNumber = Math.min(
            Math.max(Number(limit) || 10, 1),
            50
        );

        const skip = (pageNumber - 1) * limitNumber;

        const [quizzes, total] = await Promise.all([

            Quiz.find(filters)
                .select(
                    "title slug description eras difficulty questions timeLimit status createdAt"
                )
                .populate("eras")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber)
                .lean(),

            Quiz.countDocuments(filters)
        ]);

        const data = quizzes.map((quiz) => ({
            ...quiz,
            questionCount: quiz.questions.length
        }));

        return res.status(200).json({
            success: true,
            message: "Quizzes fetched successfully",
            data,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages: Math.ceil(total / limitNumber)
            }
        });

    } catch (err) {
        next(err);
    }
};


// ============================================================
// GET PUBLISHED QUIZ DETAILS
// GET /api/v1/quizzes/:id
// ============================================================

export const getQuiz = async (req, res, next) => {

    try {

        const quizId = req.params.id;

        if (!isValidId(quizId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid quiz ID"
            });
        }

        const quiz = await Quiz.findOne({
            _id: quizId,
            status: "published"
        })
            .populate("eras")
            .lean();

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Published quiz not found"
            });
        }

        // Do not expose answer keys on this endpoint.
        const questionIds = quiz.questions.map(
            (item) => item.question
        );

        const questions = await QuizQuestion.find({
            _id: { $in: questionIds }
        })
            .select("_id questionText options explanation")
            .lean();

        const questionMap = new Map(
            questions.map((question) => [
                question._id.toString(),
                question
            ])
        );

        const orderedQuestions = quiz.questions
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((item) => {

                const question = questionMap.get(
                    item.question.toString()
                );

                if (!question) {
                    return null;
                }

                return {
                    questionId: question._id,
                    questionText: question.questionText,
                    options: question.options,
                    explanation: question.explanation,
                    order: item.order,
                    points: item.points
                };
            });

        if (orderedQuestions.some((question) => !question)) {
            return res.status(409).json({
                success: false,
                message: "This quiz contains missing questions"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Quiz fetched successfully",
            data: {
                ...quiz,
                questionCount: orderedQuestions.length,
                questions: orderedQuestions
            }
        });

    } catch (err) {
        next(err);
    }
};


// ============================================================
// START OR RESUME QUIZ ATTEMPT
// POST /api/v1/quizzes/:id/start
// ============================================================

export const startQuiz = async (req, res, next) => {

    try {

        const userId = getUserId(req);
        const quizId = req.params.id;

        if (!userId || !isValidId(userId)) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (!isValidId(quizId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid quiz ID"
            });
        }

        const quiz = await Quiz.findOne({
            _id: quizId,
            status: "published"
        }).lean();

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Published quiz not found"
            });
        }

        if (!quiz.questions.length) {
            return res.status(400).json({
                success: false,
                message: "This quiz has no questions"
            });
        }

        // Resume an existing attempt instead of creating duplicates.
        const existingAttempt = await QuizAttempt.findOne({
            user: userId,
            quiz: quizId,
            status: "in_progress"
        });

        if (existingAttempt) {

            if (isTimeExpired(
                existingAttempt,
                quiz.timeLimit
            )) {

                await finalizeAttempt(existingAttempt);

                return res.status(409).json({
                    success: false,
                    message: "The time limit has expired",
                    data: sanitizeAttempt(existingAttempt, true)
                });
            }

            return res.status(200).json({
                success: true,
                message: "Existing quiz attempt resumed",
                data: sanitizeAttempt(existingAttempt)
            });
        }

        const orderedQuestions = quiz.questions
            .slice()
            .sort((a, b) => a.order - b.order);

        // Validate that the quiz has usable questions and no duplicates.
        const questionIds = orderedQuestions.map(
            (item) => item.question.toString()
        );

        if (new Set(questionIds).size !== questionIds.length) {
            return res.status(400).json({
                success: false,
                message: "Quiz contains duplicate questions"
            });
        }

        const questionDocuments = await QuizQuestion.find({
            _id: { $in: questionIds }
        }).lean();

        const questionMap = new Map(
            questionDocuments.map((question) => [
                question._id.toString(),
                question
            ])
        );

        const answers = [];

        for (const item of orderedQuestions) {

            const question = questionMap.get(
                item.question.toString()
            );

            if (
                !question ||
                !Array.isArray(question.options) ||
                question.options.length !== 4 ||
                !Number.isInteger(question.correctAnswerIndex) ||
                question.correctAnswerIndex < 0 ||
                question.correctAnswerIndex > 3
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Quiz contains an invalid question"
                });
            }

            answers.push({
                question: question._id,
                questionText: question.questionText,
                options: question.options,
                correctAnswerIndex: question.correctAnswerIndex,
                selectedAnswerIndex: null,
                isCorrect: null,
                points: item.points,
                earnedPoints: 0
            });
        }

        const maxScore = answers.reduce(
            (total, answer) => total + answer.points,
            0
        );

        if (maxScore < 1) {
            return res.status(400).json({
                success: false,
                message: "Quiz must have a positive maximum score"
            });
        }

        const attempt = await QuizAttempt.create({
            user: userId,
            quiz: quiz._id,
            quizTitle: quiz.title,
            answers,
            score: 0,
            maxScore,
            percentage: 0,
            status: "in_progress",
            startedAt: new Date(),
            completedAt: null,
            durationSeconds: 0
        });

        return res.status(201).json({
            success: true,
            message: "Quiz attempt started successfully",
            data: sanitizeAttempt(attempt)
        });

    } catch (err) {
        next(err);
    }
};


// ============================================================
// SAVE ANSWER
// POST /api/v1/quiz-attempts/:id/answer
// ============================================================

export const saveQuizAnswer = async (req, res, next) => {

    try {

        const userId = getUserId(req);
        const attemptId = req.params.id;

        const {
            questionId,
            selectedAnswerIndex
        } = req.body;

        if (!userId || !isValidId(userId)) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (!isValidId(attemptId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid attempt ID"
            });
        }

        if (!isValidId(questionId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid question ID"
            });
        }

        if (
            !Number.isInteger(selectedAnswerIndex) ||
            selectedAnswerIndex < 0 ||
            selectedAnswerIndex > 3
        ) {
            return res.status(400).json({
                success: false,
                message: "Selected answer must be an integer between 0 and 3"
            });
        }

        const attempt = await QuizAttempt.findOne({
            _id: attemptId,
            user: userId
        });

        if (!attempt) {
            return res.status(404).json({
                success: false,
                message: "Quiz attempt not found"
            });
        }

        if (attempt.status !== "in_progress") {
            return res.status(409).json({
                success: false,
                message: "This quiz attempt is no longer active"
            });
        }

        // Check the quiz's current limit. Prefer storing the limit
        // in the attempt snapshot in a future schema migration.
        const quiz = await Quiz.findById(attempt.quiz)
            .select("timeLimit")
            .lean();

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }

        if (isTimeExpired(attempt, quiz.timeLimit)) {

            await finalizeAttempt(attempt);

            return res.status(409).json({
                success: false,
                message: "Time limit expired; quiz has been submitted",
                data: sanitizeAttempt(attempt, true)
            });
        }

        const answer = attempt.answers.find(
            (item) => item.question.toString() === questionId
        );

        if (!answer) {
            return res.status(400).json({
                success: false,
                message: "Question does not belong to this attempt"
            });
        }

        answer.selectedAnswerIndex = selectedAnswerIndex;

        // The answer is evaluated only when the attempt is submitted.
        answer.isCorrect = null;
        answer.earnedPoints = 0;

        await attempt.save();

        return res.status(200).json({
            success: true,
            message: "Answer saved successfully",
            data: {
                attemptId: attempt._id,
                questionId,
                selectedAnswerIndex,
                saved: true
            }
        });

    } catch (err) {
        next(err);
    }
};


// ============================================================
// SUBMIT QUIZ
// POST /api/v1/quiz-attempts/:id/submit
// ============================================================

export const submitQuiz = async (req, res, next) => {

    try {

        const userId = getUserId(req);
        const attemptId = req.params.id;

        if (!userId || !isValidId(userId)) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (!isValidId(attemptId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid attempt ID"
            });
        }

        const attempt = await QuizAttempt.findOne({
            _id: attemptId,
            user: userId
        });

        if (!attempt) {
            return res.status(404).json({
                success: false,
                message: "Quiz attempt not found"
            });
        }

        // Idempotent behavior: return the saved result.
        if (attempt.status === "completed") {
            return res.status(200).json({
                success: true,
                message: "Quiz has already been submitted",
                data: sanitizeAttempt(attempt, true)
            });
        }

        if (attempt.status !== "in_progress") {
            return res.status(409).json({
                success: false,
                message: "This attempt cannot be submitted"
            });
        }

        await finalizeAttempt(attempt);

        return res.status(200).json({
            success: true,
            message: "Quiz submitted successfully",
            data: sanitizeAttempt(attempt, true)
        });

    } catch (err) {
        next(err);
    }
};


// ============================================================
// GET MY QUIZ ATTEMPTS
// GET /api/v1/quiz-attempts/me
// ============================================================

export const getMyQuizAttempts = async (req, res, next) => {

    try {

        const userId = getUserId(req);

        if (!userId || !isValidId(userId)) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const pageNumber = Math.max(
            Number(req.query.page) || 1,
            1
        );

        const limitNumber = Math.min(
            Math.max(Number(req.query.limit) || 10, 1),
            50
        );

        const filters = { user: userId };

        const skip = (pageNumber - 1) * limitNumber;

        const [attempts, total] = await Promise.all([

            QuizAttempt.find(filters)
                .select(
                    "quiz quizTitle score maxScore percentage status startedAt completedAt durationSeconds createdAt"
                )
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber)
                .lean(),

            QuizAttempt.countDocuments(filters)
        ]);

        return res.status(200).json({
            success: true,
            message: "Quiz attempt history fetched successfully",
            data: attempts,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages: Math.ceil(total / limitNumber)
            }
        });

    } catch (err) {
        next(err);
    }
};


// ============================================================
// GET ATTEMPT DETAILS
// GET /api/v1/quiz-attempts/:id
// ============================================================

export const getQuizAttempt = async (req, res, next) => {

    try {

        const userId = getUserId(req);
        const attemptId = req.params.id;

        if (!userId || !isValidId(userId)) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (!isValidId(attemptId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid attempt ID"
            });
        }

        const attempt = await QuizAttempt.findOne({
            _id: attemptId,
            user: userId
        });

        if (!attempt) {
            return res.status(404).json({
                success: false,
                message: "Quiz attempt not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Quiz attempt fetched successfully",
            data: sanitizeAttempt(
                attempt,
                attempt.status === "completed"
            )
        });

    } catch (err) {
        next(err);
    }
};


// ============================================================
// ABANDON ATTEMPT
// POST /api/v1/quiz-attempts/:id/abandon
// ============================================================

export const abandonQuizAttempt = async (req, res, next) => {

    try {

        const userId = getUserId(req);
        const attemptId = req.params.id;

        if (!userId || !isValidId(userId)) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (!isValidId(attemptId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid attempt ID"
            });
        }

        const attempt = await QuizAttempt.findOne({
            _id: attemptId,
            user: userId
        });

        if (!attempt) {
            return res.status(404).json({
                success: false,
                message: "Quiz attempt not found"
            });
        }

        if (attempt.status !== "in_progress") {
            return res.status(409).json({
                success: false,
                message: "Only active attempts can be abandoned"
            });
        }

        attempt.status = "abandoned";
        attempt.completedAt = new Date();
        attempt.durationSeconds = Math.max(
            0,
            Math.floor(
                (attempt.completedAt.getTime() -
                    new Date(attempt.startedAt).getTime()) / 1000
            )
        );

        await attempt.save();

        return res.status(200).json({
            success: true,
            message: "Quiz attempt abandoned successfully",
            data: {
                _id: attempt._id,
                status: attempt.status,
                durationSeconds: attempt.durationSeconds
            }
        });

    } catch (err) {
        next(err);
    }
};

