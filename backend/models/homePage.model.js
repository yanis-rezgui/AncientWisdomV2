
import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
            trim: true,
        },

        answer: {
            type: String,
            required: true,
            trim: true,
        },

        order: {
            type: Number,
            default: 0,
        },

        isPublished: {
            type: Boolean,
            default: true,
        },
    },
    {
        _id: true,
    }
);

const homePageSchema = new mongoose.Schema(
    {
        // Quotes displayed on the homepage
        quotesOfTheDay: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Quote",
            },
        ],

        // Featured historical figures
        featuredFigures: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Figure",
            },
        ],

        // Featured historical eras
        featuredEras: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "HistoricalEra",
            },
        ],

        // Featured historical events
        featuredEvents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event",
            },
        ],

        // FAQs managed directly inside the homepage document
        faqs: {
            type: [faqSchema],
            default: [],
        },

        // Optional publication status
        isPublished: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const HomePage = mongoose.model("HomePage", homePageSchema);

export default HomePage;
