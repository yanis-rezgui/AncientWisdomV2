
import Settings from "../models/settings.model.js";

const settingsData = {
    name: "Ancient Wisdom",
    slogan: "Discover the wisdom of the past",
    email: "contact@ancientwisdom.com",

    socialLinks: [
        {
            platform: "instagram",
            url: "https://www.instagram.com/ancientwisdom",
            isActive: true,
        },
        {
            platform: "youtube",
            url: "https://www.youtube.com/@ancientwisdom",
            isActive: true,
        },
        {
            platform: "facebook",
            url: "https://www.facebook.com/ancientwisdom",
            isActive: false,
        },
        {
            platform: "github",
            url: "https://github.com/your-username",
            isActive: true,
        },
    ],
};

const seedSettings = async () => {
    try {
        const existingSettings = await Settings.findOne();

        if (existingSettings) {
            existingSettings.set(settingsData);
            await existingSettings.save();

            console.log("Settings updated successfully.");
        } else {
            await Settings.create(settingsData);

            console.log("Settings created successfully.");
        }

        console.log("Settings seed completed.");
    } catch (error) {
        console.error("Error seeding settings:", error);
        throw error;
    }
};

export default seedSettings;
