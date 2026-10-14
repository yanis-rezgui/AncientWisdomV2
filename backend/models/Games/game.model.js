
import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Game title is required"],
            trim: true,
            minLength: 3,
            maxLength: 150,
        },

        slug: {
            type: String,
            required: [true, "Game slug is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },

        description: {
            type: String,
            required: [true, "Game description is required"],
            trim: true,
            minLength: 10,
            maxLength: 1000,
        },

        gameType: {
            type: String,
            enum: [
                "guess-the-figure",
                "name-the-landmark",
                "word-scramble",
                "history-memory",
                "where-in-history",
            ],
            required: true,
            unique: true,
        },

        instructions: {
            type: [String],
            default: [],
        },

        image: {
            url: {
                type: String,
                required: true,
            },
            publicId: {
                type: String,
                required: true,
            },
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Easy",
            required: true,
        },

        estimatedDuration: {
            type: Number,
            min: 1,
            default: 3,
        },

        status: {
            type: String,
            enum: ["draft", "published", "archived"],
            default: "draft",
            required: true,
        },

        sortOrder: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

gameSchema.index({ status: 1, sortOrder: 1 });

const Game = mongoose.model("Game", gameSchema);

export default Game;
