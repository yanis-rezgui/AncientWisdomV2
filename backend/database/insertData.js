



import mongoose from "mongoose";

import HistoricalEra from "../models/historicalEra.model.js";





const seedDatabase = async () => {
    try {
     
// =========================================================
// HISTORICAL ERA
// =========================================================

const ancientEgypt = await HistoricalEra.create({
    name: "Ancient Egypt",

    startYear: -3100,
    endYear: -30,

    description:
        "Ancient Egypt was one of the world's earliest and most enduring civilizations. Emerging around 3100 BCE along the Nile River, Egyptian civilization developed a powerful state, monumental architecture, complex religious traditions, and a writing system that influenced the ancient Mediterranean world for thousands of years.",

    image: {
        url: "https://ancient-wisdom-ivory.vercel.app/images/egypt.jpg",
        publicId: "ancient-wisdom/egypt"
    }
});

const classicalGreece = await HistoricalEra.create({
    name: "Classical Greece",

    startYear: -800,
    endYear: -323,

    description:
        "Classical Greece was a defining period of ancient Greek civilization, marked by the development of powerful city-states such as Athens and Sparta. It was a period of major political, philosophical, artistic, and scientific achievements whose ideas profoundly influenced the Mediterranean world and later civilizations.",

    image: {
        url: "https://ancient-wisdom-ivory.vercel.app/images/greece.jpg",
        publicId: "ancient-wisdom/greece"
    }
});

const ancientRome = await HistoricalEra.create({
    name: "Ancient Rome",

    startYear: -753,
    endYear: 476,

    description:
        "Ancient Rome was one of the most influential civilizations in history. From its traditional foundation in 753 BCE to the fall of the Western Roman Empire in 476 CE, Rome developed from a small settlement into a vast civilization whose influence extended across Europe, North Africa, and the Mediterranean.",

    image: {
        url: "https://ancient-wisdom-ivory.vercel.app/images/rome.jpg",
        publicId: "ancient-wisdom/rome"
    }
});

const middleAges = await HistoricalEra.create({
    name: "Middle Ages",

    startYear: 476,
    endYear: 1453,

    description:
        "The Middle Ages was a broad period of history that followed the fall of the Western Roman Empire. It witnessed the development of medieval kingdoms, the expansion of major religions, the growth of cities and trade networks, and profound political, social, and cultural transformations across Europe and the Mediterranean.",

    image: {
        url: "https://ancient-wisdom-ivory.vercel.app/images/middle-ages.jpg",
        publicId: "ancient-wisdom/middle-ages"
    }
});

console.log("Historical eras created");

    } catch (error) {
        console.error("Seed failed:", error);
        await mongoose.disconnect();
        process.exit(1);
    }
};

export default seedDatabase;