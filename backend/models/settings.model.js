import mongoose from "mongoose";

const socialLinkSchema = new mongoose.Schema(
    {
        platform: {
            type: String,
            required: true,
            enum: [
                "facebook",
                "instagram",
                "youtube",
                "tiktok",
                "x",
                "linkedin",
                "github",
                "discord",
                "other",
            ],
        },

        url: {
            type: String,
            required: true,
            trim: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        _id: true,
    }
);

const settingsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
            default: "Ancient Wisdom",
        },

        slogan: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
            default: "Discover the wisdom of the past",
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },

        socialLinks: {
            type: [socialLinkSchema],
            default: [],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
