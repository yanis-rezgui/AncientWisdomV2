
import mongoose from "mongoose";

const attemptAnswerSchema = new mongoose.Schema(
    {
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "QuizQuestion",
            required: true,
        },

        // Contenu conservé au moment de la tentative
        questionText: {
            type: String,
            required: true,
        },

        options: {
            type: [String],
            required: true,
            validate: {
                validator: (options) => options.length === 4,
                message: "A question must have exactly four options.",
            },
        },

        correctAnswerIndex: {
            type: Number,
            required: true,
            min: 0,
            max: 3,
        },

        selectedAnswerIndex: {
            type: Number,
            default: null,
            min: 0,
            max: 3,
        },

        isCorrect: {
            type: Boolean,
            default: null,
        },

        points: {
            type: Number,
            required: true,
            min: 1,
        },

        earnedPoints: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
            required: true,
        },

        quizTitle: {
            type: String,
            required: true,
            trim: true,
        },

        answers: {
            type: [attemptAnswerSchema],
            default: [],
        },

        score: {
            type: Number,
            default: 0,
            min: 0,
        },

        maxScore: {
            type: Number,
            required: true,
            min: 1,
        },

        percentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        status: {
            type: String,
            enum: ["in_progress", "completed", "abandoned"],
            default: "in_progress",
        },

        startedAt: {
            type: Date,
            default: Date.now,
        },

        completedAt: {
            type: Date,
            default: null,
        },

        durationSeconds: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    { timestamps: true }
);

quizAttemptSchema.index({ user: 1, createdAt: -1 });
quizAttemptSchema.index({ quiz: 1, status: 1 });

const QuizAttempt = mongoose.model(
    "QuizAttempt",
    quizAttemptSchema
);

export default QuizAttempt;