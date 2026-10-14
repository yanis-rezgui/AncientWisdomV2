
import mongoose from "mongoose";

const landmarkChallengeSchema = new mongoose.Schema(
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

        answer: {
            type: String,
            required: true,
            trim: true,
        },

        options: {
            type: [String],
            required: true,
            validate: {
                validator: options =>
                    options.length === 4 &&
                    new Set(
                        options.map(option =>
                            option.trim().toLowerCase()
                        )
                    ).size === 4,
                message: "Exactly four unique options are required.",
            },
        },

        hint: {
            type: String,
            default: "",
            maxLength: 500,
        },

        explanation: {
            type: String,
            default: "",
            maxLength: 2000,
        },

        location: {
            type: String,
            default: "",
            maxLength: 200,
        },

        civilization: {
            type: String,
            default: "",
            maxLength: 150,
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

landmarkChallengeSchema.index({
    status: 1,
    difficulty: 1,
});

const LandmarkChallenge = mongoose.model(
    "LandmarkChallenge",
    landmarkChallengeSchema
);

export default LandmarkChallenge;
