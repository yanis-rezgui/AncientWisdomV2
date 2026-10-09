
import mongoose from "mongoose";

const frameSchema = new mongoose.Schema(
    {
        // Frame title
        title: {
            type: String,
            required: [true, "Frame title is required"],
            trim: true,
            minlength: 3,
            maxlength: 150,
        },

        // Frame type
        type: {
            type: String,
            required: [true, "Frame type is required"],
            enum: {
                values: ["Monument", "Statue", "Map"],
                message: "Type must be Monument, Statue, or Map",
            },
        },

        // Cloudinary image
        image: {
            url: {
                type: String,
                required: [true, "Image URL is required"],
            },
            publicId: {
                type: String,
                required: [true, "Image public ID is required"],
            },
        },

        // Optional description
        description: {
            type: String,
            trim: true,
            maxlength: 2000,
            default: "",
        },

        // Optional historical era
        era: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "HistoricalEra",
            default: null,
        },

        // Optional location
        location: {
            type: String,
            trim: true,
            maxlength: 200,
            default: "",
        },

        // Optional image source or credit
        source: {
            type: String,
            trim: true,
            maxlength: 500,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

// Useful indexes
frameSchema.index({ title: 1 });
frameSchema.index({ createdAt: -1 });

const Frame = mongoose.model("Frame", frameSchema);

export default Frame;

