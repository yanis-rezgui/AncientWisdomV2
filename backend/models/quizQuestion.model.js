
import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema(
    {
        questionText: {
            type: String,
            required: [true, "Question text is required"],
            trim: true,
            minlength: [10, "Question must contain at least 10 characters"],
            maxlength: [1000, "Question cannot exceed 1000 characters"],
        },

        options: {
            type: [String],
            required: [true, "Answer options are required"],
            validate: [
                {
                    validator: function (options) {
                        return options.length === 4;
                    },
                    message: "A question must have exactly 4 options",
                },
                {
                    validator: function (options) {
                        return options.every(
                            (option) =>
                                typeof option === "string" &&
                                option.trim().length > 0
                        );
                    },
                    message: "All options must be non-empty strings",
                },
                {
                    validator: function (options) {
                        const normalizedOptions = options.map((option) =>
                            option.trim().toLowerCase()
                        );

                        return new Set(normalizedOptions).size === 4;
                    },
                    message: "Answer options must be unique",
                },
            ],
        },

        correctAnswerIndex: {
            type: Number,
            required: [true, "Correct answer index is required"],
            min: [0, "Correct answer index must be between 0 and 3"],
            max: [3, "Correct answer index must be between 0 and 3"],
            validate: {
                validator: Number.isInteger,
                message: "Correct answer index must be an integer",
            },
        },

        explanation: {
            type: String,
            trim: true,
            maxlength: [2000, "Explanation cannot exceed 2000 characters"],
            default: "",
        },

        era: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "HistoricalEra",
            required: [true, "Historical era is required"],
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: [true, "Question difficulty is required"],
            default: "Easy",
        },

        source: {
            type: String,
            trim: true,
            maxlength: [500, "Source cannot exceed 500 characters"],
            default: "",
        },

        tags: {
            type: [String],
            default: [],
            validate: {
                validator: function (tags) {
                    return tags.every(
                        (tag) =>
                            typeof tag === "string" &&
                            tag.trim().length > 0
                    );
                },
                message: "Tags must be non-empty strings",
            },
        },

        status: {
            type: String,
            enum: ["draft", "published", "archived"],
            default: "draft",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Useful indexes for admin searches and question selection.
quizQuestionSchema.index({ era: 1, difficulty: 1, status: 1 });
quizQuestionSchema.index({ status: 1, createdAt: -1 });

const QuizQuestion = mongoose.model(
    "QuizQuestion",
    quizQuestionSchema
);

export default QuizQuestion;

