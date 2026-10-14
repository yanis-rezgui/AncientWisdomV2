
import mongoose from "mongoose";

const memoryChallengeSchema = new mongoose.Schema(
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

        pairType: {
            type: String,
            enum: [
                "figure-portrait",
                "landmark-name",
                "event-date",
                "civilization-artifact",
                "custom",
            ],
            required: true,
        },

        cards: {
            type: [
                {
                    pairId: {
                        type: String,
                        required: true,
                    },

                    contentType: {
                        type: String,
                        enum: ["text", "image"],
                        required: true,
                    },

                    text: {
                        type: String,
                        default: "",
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
                },
            ],
            required: true,
            validate: {
                validator: cards =>
                    cards.length >= 4 &&
                    cards.length % 2 === 0,
                message: "Cards must contain an even number of entries.",
            },
        },

        explanation: {
            type: String,
            default: "",
            maxLength: 2000,
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Easy",
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

memoryChallengeSchema.index({
    status: 1,
    difficulty: 1,
});

const MemoryChallenge = mongoose.model(
    "MemoryChallenge",
    memoryChallengeSchema
);

export default MemoryChallenge;
