
import mongoose from "mongoose";

const wordChallengeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxLength: 150,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        answer: {
            type: String,
            required: true,
            trim: true,
            maxLength: 100,
        },

        scrambledLetters: {
            type: String,
            required: true,
            trim: true,
            maxLength: 100,
        },

        hint: {
            type: String,
            default: "",
            maxLength: 500,
        },

        explanation: {
            type: String,
            default: "",
            maxLength: 1000,
        },

        category: {
            type: String,
            enum: [
                "figure",
                "event",
                "place",
                "civilization",
                "era",
                "artifact",
                "other",
            ],
            default: "other",
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Easy",
        },

        points: {
            type: Number,
            default: 10,
            min: 1,
        },

        status: {
            type: String,
            enum: ["draft", "published", "archived"],
            default: "draft",
        },
    },
    {
        timestamps: true,
    }
);

wordChallengeSchema.index({
    status: 1,
    difficulty: 1,
});

const WordChallenge = mongoose.model(
    "WordChallenge",
    wordChallengeSchema
);

export default WordChallenge;
