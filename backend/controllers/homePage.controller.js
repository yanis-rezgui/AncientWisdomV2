
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
            faqs: [],
            isPublished: true,
        });
    }

    return homePage;
};

const populateHomePage = (query) => {
    return query
        .populate({
            path: "quotesOfTheDay",
            populate: [
                { path: "author" },
                { path: "era" },
            ],
        })
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
    return [...new Set(ids.map((id) => id.toString()))];
};

// ============================================================
// FAQ VALIDATION
// ============================================================

const validateFAQs = (faqs) => {
    if (!Array.isArray(faqs)) {
        return {
            valid: false,
            message: "faqs must be an array.",
        };
    }

    const normalizedFAQs = [];

    for (let index = 0; index < faqs.length; index++) {
        const faq = faqs[index];

        if (
            !faq ||
            typeof faq !== "object" ||
            Array.isArray(faq)
        ) {
            return {
                valid: false,
                message: `FAQ at index ${index} must be an object.`,
            };
        }

        if (
            typeof faq.question !== "string" ||
            !faq.question.trim()
        ) {
            return {
                valid: false,
                message: `FAQ at index ${index} must have a question.`,
            };
        }

        if (
            typeof faq.answer !== "string" ||
            !faq.answer.trim()
        ) {
            return {
                valid: false,
                message: `FAQ at index ${index} must have an answer.`,
            };
        }

        if (
            faq.order !== undefined &&
            (!Number.isInteger(faq.order) || faq.order < 0)
        ) {
            return {
                valid: false,
                message: `FAQ at index ${index} must have a non-negative integer order.`,
            };
        }

        if (
            faq.isPublished !== undefined &&
            typeof faq.isPublished !== "boolean"
        ) {
            return {
                valid: false,
                message: `FAQ at index ${index} must have a boolean isPublished value.`,
            };
        }

        if (
            faq._id !== undefined &&
            !mongoose.isValidObjectId(faq._id)
        ) {
            return {
                valid: false,
                message: `FAQ at index ${index} has an invalid _id.`,
            };
        }

        const normalizedFAQ = {
            question: faq.question.trim(),
            answer: faq.answer.trim(),
            order: faq.order ?? index,
            isPublished: faq.isPublished ?? true,
        };

        // Preserve existing FAQ IDs when updating.
        if (faq._id) {
            normalizedFAQ._id = faq._id;
        }

        normalizedFAQs.push(normalizedFAQ);
    }

    return {
        valid: true,
        data: normalizedFAQs.sort((a, b) => a.order - b.order),
    };
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

        // Return FAQs in display order.
        populatedHomePage.faqs = (populatedHomePage.faqs ?? [])
            .sort((a, b) => a.order - b.order);

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
            faqs,
            isPublished,
        } = req.body;

        // Validate the reference arrays.
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

        // Validate FAQs.
        const faqValidation = validateFAQs(faqs);

        if (!faqValidation.valid) {
            return res.status(400).json({
                success: false,
                message: faqValidation.message,
            });
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
            faqs: faqValidation.data,
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

        if (!populatedHomePage) {
            return res.status(404).json({
                success: false,
                message: "Homepage configuration not found after update.",
            });
        }

        populatedHomePage.faqs = (populatedHomePage.faqs ?? [])
            .sort((a, b) => a.order - b.order);

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
