
import HomePage from "../models/homePage.model.js";

const homePageSeed = async () => {
    try {
        const existingHomePage = await HomePage.findOne();

        if (existingHomePage) {
            console.log("HomePage already exists.");
            return;
        }

        await HomePage.create({
            quotesOfTheDay: [],
            featuredFigures: [],
            featuredEras: [],
            featuredEvents: [],
            isPublished: true,
        });

        console.log("HomePage created successfully.");
    } catch (error) {
        console.error("Error creating HomePage:", error);
        throw error;
    }
};

export default homePageSeed;
