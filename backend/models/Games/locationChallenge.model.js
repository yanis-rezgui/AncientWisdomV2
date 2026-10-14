
import mongoose from "mongoose";

const locationChallengeSchema = new mongoose.Schema(
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

        question: {
            type: String,
            required: true,
            trim: true,
            maxLength: 500,
        },

        answer: {
            type: String,
            required: true,
            trim: true,
            maxLength: 200,
        },

        coordinates: {
            latitude: {
                type: Number,
                required: true,
                min: -90,
                max: 90,
            },

            longitude: {
                type: Number,
                required: true,
                min: -180,
                max: 180,
            },
        },

        mapZoom: {
            type: Number,
            default: 4,
            min: 1,
            max: 18,
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

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Easy",
        },

        points: {
            type: Number,
            default: 100,
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

locationChallengeSchema.index({
    status: 1,
    difficulty: 1,
});

const LocationChallenge = mongoose.model(
    "LocationChallenge",
    locationChallengeSchema
);

export default LocationChallenge;
