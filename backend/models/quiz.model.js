
import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Quiz title is required"],
            trim: true,
            minLength: 3,
            maxLength: 150,
        },

        slug: {
            type: String,
            required: [true, "Quiz slug is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },

        description: {
            type: String,
            required: [true, "Quiz description is required"],
            trim: true,
            minLength: 10,
            maxLength: 1000,
        },


        eras: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "HistoricalEra",
                },
            ],
            default: [],
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Medium",
            required: true,
        },

        questions: {
            type: [
                {
                    question: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "QuizQuestion",
                        required: true,
                    },

                    order: {
                        type: Number,
                        required: true,
                        min: 1,
                    },

                    points: {
                        type: Number,
                        default: 1,
                        min: 1,
                    },
                },
            ],
            default: [],
        },

        timeLimit: {
            type: Number,
            default: null,
            min: 1,
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

quizSchema.index({ status: 1, category: 1 });
quizSchema.index({ status: 1, difficulty: 1 });

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;