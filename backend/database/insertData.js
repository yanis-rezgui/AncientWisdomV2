
import mongoose from "mongoose";
import Tips from "../models/Learn/tips.model.js";


const tipsData = {
    introduction:
        "Learning history is not just about memorizing dates, it’s about understanding connections, causes, and consequences. Ancient Wisdom gives you the tools to explore history through inspiring quotes, detailed biographies, interactive maps, and key historical events.",

    tips: [
        {
            title: "Start with Quotes to Spark Curiosity",
            why:
                "Quotes are a quick gateway into an era, a mindset, or a historical figure. They can ignite your curiosity and make you want to learn more.",
            how:
                "Start by browsing the Quotes section, then visit the Explore page to read detailed biographies of the authors. This helps you understand the life, context, and historical background behind their words.",
        },
        {
            title: "Connect People to Events",
            why:
                "Understanding a historical event becomes easier when you know the people who shaped it.",
            how:
                "From any entry in Historical Events, note the key figures mentioned, then visit the Explore section to read their biographies and understand their role.",
        },
        {
            title: "Learn Through Maps",
            why:
                "Maps help visualize the reach of an empire, trade routes, or population movements.",
            how:
                'Visit the "History in Frames" section to place events and figures in their geographical context.',
        },
        {
            title: "Compare Civilizations",
            why:
                "Comparing two eras or regions makes it easier to remember their differences and similarities.",
            how:
                "Use maps, biographies and historical events to compare civilizations, such as Rome and Persia.",
        },
        {
            title: "Use Stories, Not Just Facts",
            why:
                "Stories make history memorable and relatable.",
            how:
                "Read the Historical Events section as narratives, not just bullet points, to immerse yourself in the past.",
        },
        {
            title: "Revisit and Review Regularly",
            why:
                "Memory strengthens with repetition and exposure.",
            how:
                "Return each week to explore new quotes, events, and maps.",
        },
        {
            title: "Explore Across Eras",
            why:
                "Understanding history means seeing how ideas, cultures, and empires evolve over time.",
            how:
                "Move between different time periods in the Historical Events and Maps sections to see the bigger picture of humanity’s journey.",
        },
        {
            title: "Make Connections Beyond the Site",
            why:
                "The best learning happens when you connect what you see here with books, documentaries, and real-life discussions.",
            how:
                "Use what you discover on the site as a starting point. Note down a quote, a map, or an event, then explore it further in books or films recommended in the History Guide section.",
        },
    ],

    conclusion:
        "History is a journey, not a race. With Ancient Wisdom, every quote, biography, and map is a step toward seeing the world through the eyes of the past.",
};

const seedTips = async () => {
    try {
        // Connect to MongoDB if your application hasn't connected already.
        if (mongoose.connection.readyState === 0) {
            throw new Error(
                "MongoDB is not connected. Connect to the database before running this seed."
            );
        }

        const existingTips = await Tips.findOne();

        let result;

        if (existingTips) {
            existingTips.set(tipsData);
            result = await existingTips.save();

            console.log("Learning Tips updated successfully.");
        } else {
            result = await Tips.create(tipsData);

            console.log("Learning Tips created successfully.");
        }

        console.log(`Number of tips: ${result.tips.length}`);
    } catch (error) {
        console.error("Error seeding Learning Tips:", error);
        throw error;
    }
};

export default seedTips;