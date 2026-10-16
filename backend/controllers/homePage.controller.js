
import mongoose from "mongoose";
import HomePage from "../models/homePage.model.js";

// ============================================================
// HELPERS
// ============================================================

const getOrCreateHomePage = async () => {
    let homePage = await HomePage.findOne();

    if (!homePage) {
        homePage = await HomePage.create({
            quotesOfTheDay: [],
            featuredFigures: [],
            featuredEras: [],
            featuredEvents: [],
            isPublished: true,
        });
    }

    return homePage;
};

const populateHomePage = (query) => {
    return query
        .populate("quotesOfTheDay")
        .populate("featuredFigures")
        .populate("featuredEras")
        .populate("featuredEvents");
};

const isValidIdArray = (value) => {
    return (
        Array.isArray(value) &&
        value.every((id) => mongoose.isValidObjectId(id))
    );
};

const normalizeIds = (ids) => {
    // Remove duplicate IDs while preserving their order.
    return [...new Set(ids.map((id) => id.toString()))];
};

// ============================================================
// GET HOMEPAGE
// GET /api/v1/homepage
// ============================================================

export const getHomePage = async (req, res) => {
    try {
        const homePage = await getOrCreateHomePage();

        const populatedHomePage = await populateHomePage(
            HomePage.findById(homePage._id)
        ).lean();

        if (!populatedHomePage) {
            return res.status(404).json({
                success: false,
                message: "Homepage configuration not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: populatedHomePage,
        });
    } catch (error) {
        console.error("Error fetching homepage:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch homepage configuration.",
        });
    }
};

// ============================================================
// UPDATE HOMEPAGE
// PUT /api/v1/admin/homepage
// ============================================================

export const updateHomePage = async (req, res) => {
    try {
        const {
            quotesOfTheDay,
            featuredFigures,
            featuredEras,
            featuredEvents,
            isPublished,
        } = req.body;

        // Validate the arrays sent by the admin.
        const arraysToValidate = {
            quotesOfTheDay,
            featuredFigures,
            featuredEras,
            featuredEvents,
        };

        for (const [field, value] of Object.entries(arraysToValidate)) {
            if (!isValidIdArray(value)) {
                return res.status(400).json({
                    success: false,
                    message: `${field} must be an array of valid MongoDB IDs.`,
                });
            }
        }

        if (
            isPublished !== undefined &&
            typeof isPublished !== "boolean"
        ) {
            return res.status(400).json({
                success: false,
                message: "isPublished must be a boolean.",
            });
        }

        const updateData = {
            quotesOfTheDay: normalizeIds(quotesOfTheDay),
            featuredFigures: normalizeIds(featuredFigures),
            featuredEras: normalizeIds(featuredEras),
            featuredEvents: normalizeIds(featuredEvents),
        };

        if (isPublished !== undefined) {
            updateData.isPublished = isPublished;
        }

        // Keep a single homepage configuration document.
        const homePage = await getOrCreateHomePage();

        Object.assign(homePage, updateData);

        await homePage.save();

        const populatedHomePage = await populateHomePage(
            HomePage.findById(homePage._id)
        ).lean();

        return res.status(200).json({
            success: true,
            message: "Homepage updated successfully.",
            data: populatedHomePage,
        });
    } catch (error) {
        console.error("Error updating homepage:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update homepage configuration.",
        });
    }
};
