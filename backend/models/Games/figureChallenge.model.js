
import mongoose from "mongoose";

const figureChallengeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minLength: 2,
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
            maxLength: 150,
        },

        acceptedAnswers: {
            type: [String],
            default: [],
        },

        image: {
            url: {
                type: String,
                default: "",
            },
            publicId: {
                type: String,
                default: "",
            },
        },

        clues: {
            type: [
                {
                    text: {
                        type: String,
                        required: true,
                        trim: true,
                        maxLength: 500,
                    },

                    points: {
                        type: Number,
                        required: true,
                        min: 0,
                    },
                },
            ],
            required: true,
            validate: {
                validator: clues => clues.length >= 2,
                message: "At least two clues are required.",
            },
        },

        explanation: {
            type: String,
            default: "",
            maxLength: 2000,
        },

        historicalContext: {
            type: String,
            default: "",
            maxLength: 500,
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Easy",
        },

        tags: {
            type: [String],
            default: [],
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

figureChallengeSchema.index({
    status: 1,
    difficulty: 1,
});

const FigureChallenge = mongoose.model(
    "FigureChallenge",
    figureChallengeSchema
);

export default FigureChallenge;
