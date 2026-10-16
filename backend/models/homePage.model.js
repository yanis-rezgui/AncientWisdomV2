
import mongoose from "mongoose";

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
