
import mongoose from "mongoose";
import Article from "../models/Learn/article.model.js";
import HistoricalEra from "../models/historicalEra.model.js";

import {
    uploadImage,
    deleteImage,
} from "../services/cloudinary.service.js";

// ============================================================
// HELPERS
// ============================================================

const escapeRegex = (value) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const validateText = (value, field, minLength, maxLength) => {
    if (typeof value !== "string") {
        throw new Error(`${field} must be a string`);
    }

    const trimmedValue = value.trim();

    if (trimmedValue.length < minLength) {
        throw new Error(
            `${field} must contain at least ${minLength} character(s)`
        );
    }

    if (trimmedValue.length > maxLength) {
        throw new Error(
            `${field} cannot exceed ${maxLength} characters`
        );
    }

    return trimmedValue;
};

const validateEra = async (eraId) => {
    if (!eraId || eraId === "") {
        throw new Error("Historical era is required");
    }

    if (!mongoose.isValidObjectId(eraId)) {
        throw new Error("Invalid historical era ID");
    }

    const eraExists = await HistoricalEra.exists({
        _id: eraId,
    });

    if (!eraExists) {
        throw new Error("Historical era not found");
    }

    return eraId;
};

// Sections may arrive as a JSON string through FormData.
const validateSections = (sections) => {
    if (typeof sections === "string") {
        try {
            sections = JSON.parse(sections);
        } catch {
            throw new Error("Sections must contain valid JSON");
        }
    }

    if (!Array.isArray(sections)) {
        throw new Error("Sections must be an array");
    }

    return sections.map((section, index) => {
        if (!section || typeof section !== "object") {
            throw new Error(`Section ${index + 1} is invalid`);
        }

        return {
            title: validateText(
                section.title,
                `Section ${index + 1} title`,
                1,
                150
            ),
            content: validateText(
                section.content,
                `Section ${index + 1} content`,
                1,
                20000
            ),
        };
    });
};

// Tags may arrive as a JSON array or a comma-separated string.
const validateTags = (tags) => {
    if (tags === undefined || tags === null || tags === "") {
        return [];
    }

    if (typeof tags === "string") {
        try {
            const parsedTags = JSON.parse(tags);

            if (Array.isArray(parsedTags)) {
                tags = parsedTags;
            } else {
                tags = tags.split(",");
            }
        } catch {
            tags = tags.split(",");
        }
    }

    if (!Array.isArray(tags)) {
        throw new Error("Tags must be an array");
    }

    if (!tags.every((tag) => typeof tag === "string")) {
        throw new Error("Every tag must be a string");
    }

    return [
        ...new Set(
            tags
                .map((tag) => tag.trim())
                .filter(Boolean)
        ),
    ];
};

const isValidationError = (error) =>
    error instanceof Error &&
    (
        error.message.includes("Title") ||
        error.message.includes("Description") ||
        error.message.includes("Section") ||
        error.message.includes("Sections") ||
        error.message.includes("Tags") ||
        error.message.includes("tag") ||
        error.message.includes("Historical era") ||
        error.message.includes("historical era") ||
        error.message.includes("historical") ||
        error.message.includes("image")
    );

// ============================================================
// GET ALL ARTICLES
// GET /api/v1/articles?page=1&limit=10&search=...
// ============================================================

export const getArticles = async (req, res) => {
    try {
        const page = Math.max(
            1,
            Number.parseInt(req.query.page, 10) || 1
        );

        const limit = Math.min(
            100,
            Math.max(
                1,
                Number.parseInt(req.query.limit, 10) || 10
            )
        );

        const skip = (page - 1) * limit;

        const search =
            typeof req.query.search === "string"
                ? req.query.search.trim()
                : "";

        const filter = {};

        if (search) {
            const regex = new RegExp(escapeRegex(search), "i");

            const matchingEras = await HistoricalEra.find({
                name: regex,
            }).select("_id").lean();

            filter.$or = [
                { title: regex },
                { description: regex },
                { tags: regex },
                { "sections.title": regex },
                { "sections.content": regex },
                {
                    era: {
                        $in: matchingEras.map((era) => era._id),
                    },
                },
            ];
        }

        const [articles, total] = await Promise.all([
            Article.find(filter)
                .populate("era", "name startYear endYear")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            Article.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            message: "Articles fetched successfully",
            data: articles,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("getArticles error:", error);

        return res.status(500).json({
            success: false,
            error: "Failed to fetch articles",
        });
    }
};

// ============================================================
// GET ONE ARTICLE
// GET /api/v1/articles/:id
// ============================================================

export const getArticle = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: "Invalid article ID",
            });
        }

        const article = await Article.findById(id)
            .populate(
                "era",
                "name startYear endYear description image"
            )
            .lean();

        if (!article) {
            return res.status(404).json({
                success: false,
                error: "Article not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Article fetched successfully",
            data: article,
        });
    } catch (error) {
        console.error("getArticle error:", error);

        return res.status(500).json({
            success: false,
            error: "Failed to fetch article",
        });
    }
};

// ============================================================
// GET ARTICLE OPTIONS
// GET /api/v1/articles/options
// ============================================================

export const getArticleOptions = async (req, res) => {
    try {
        const articles = await Article.find({})
            .select("_id title")
            .sort({ title: 1 })
            .lean();

        return res.status(200).json({
            success: true,
            message: "Article options fetched successfully",
            data: articles,
        });
    } catch (error) {
        console.error("getArticleOptions error:", error);

        return res.status(500).json({
            success: false,
            error: "Failed to fetch article options",
        });
    }
};

// ============================================================
// ADD ARTICLE
// POST /api/v1/articles
// ============================================================

export const addArticle = async (req, res) => {
    let uploadedImage = null;

    try {
        const title = validateText(
            req.body.title,
            "Title",
            1,
            150
        );

        const description = validateText(
            req.body.description,
            "Description",
            1,
            3000
        );

        const era = await validateEra(req.body.era);

        const tags = validateTags(req.body.tags);

        const sections =
            req.body.sections === undefined ||
            req.body.sections === null ||
            req.body.sections === ""
                ? []
                : validateSections(req.body.sections);

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "Article image is required",
            });
        }

        uploadedImage = await uploadImage(
            req.file,
            "Ancient-Wisdom/articles"
        );

        const article = await Article.create({
            title,
            description,
            era,
            tags,
            sections,
            image: {
                url: uploadedImage.url,
                publicId: uploadedImage.publicId,
            },
        });

        const populatedArticle = await Article.findById(article._id)
            .populate("era", "name startYear endYear")
            .lean();

        return res.status(201).json({
            success: true,
            message: "Article created successfully",
            data: populatedArticle,
        });
    } catch (error) {
        if (uploadedImage?.publicId) {
            try {
                await deleteImage(uploadedImage.publicId);
            } catch (cleanupError) {
                console.error(
                    "Failed to clean up uploaded article image:",
                    cleanupError
                );
            }
        }

        console.error("addArticle error:", error);

        return res.status(
            isValidationError(error) ||
            error instanceof mongoose.Error.ValidationError
                ? 400
                : 500
        ).json({
            success: false,
            error: error instanceof Error
                ? error.message
                : "Failed to create article",
        });
    }
};

// ============================================================
// UPDATE ARTICLE
// PUT /api/v1/articles/:id
// ============================================================

export const updateArticle = async (req, res) => {
    let uploadedImage = null;

    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: "Invalid article ID",
            });
        }

        const article = await Article.findById(id);

        if (!article) {
            return res.status(404).json({
                success: false,
                error: "Article not found",
            });
        }

        const updates = {};

        // TITLE
        if (req.body.title !== undefined) {
            updates.title = validateText(
                req.body.title,
                "Title",
                1,
                150
            );
        }

        // DESCRIPTION
        if (req.body.description !== undefined) {
            updates.description = validateText(
                req.body.description,
                "Description",
                1,
                3000
            );
        }

        // HISTORICAL ERA
        if (req.body.era !== undefined) {
            updates.era = await validateEra(req.body.era);
        }

        // SECTIONS
        if (req.body.sections !== undefined) {
            updates.sections =
                req.body.sections === "" ||
                req.body.sections === null
                    ? []
                    : validateSections(req.body.sections);
        }

        // TAGS
        if (req.body.tags !== undefined) {
            updates.tags = validateTags(req.body.tags);
        }

        const oldImagePublicId = article.image?.publicId;

        // IMAGE
        if (req.file) {
            uploadedImage = await uploadImage(
                req.file,
                "Ancient-Wisdom/articles"
            );

            updates.image = {
                url: uploadedImage.url,
                publicId: uploadedImage.publicId,
            };
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                error: "No valid fields provided to update",
            });
        }

        Object.assign(article, updates);
        await article.save();

        // Delete the old image only after the database update succeeds.
        if (
            uploadedImage &&
            oldImagePublicId &&
            oldImagePublicId !== uploadedImage.publicId
        ) {
            try {
                await deleteImage(oldImagePublicId);
            } catch (cleanupError) {
                console.error(
                    "Failed to delete previous article image:",
                    cleanupError
                );
            }
        }

        const updatedArticle = await Article.findById(id)
            .populate("era", "name startYear endYear")
            .lean();

        return res.status(200).json({
            success: true,
            message: "Article updated successfully",
            data: updatedArticle,
        });
    } catch (error) {
        if (uploadedImage?.publicId) {
            try {
                await deleteImage(uploadedImage.publicId);
            } catch (cleanupError) {
                console.error(
                    "Failed to clean up new article image:",
                    cleanupError
                );
            }
        }

        console.error("updateArticle error:", error);

        return res.status(
            isValidationError(error) ||
            error instanceof mongoose.Error.ValidationError
                ? 400
                : 500
        ).json({
            success: false,
            error: error instanceof Error
                ? error.message
                : "Failed to update article",
        });
    }
};

// ============================================================
// DELETE ARTICLE
// DELETE /api/v1/articles/:id
// ============================================================

export const deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: "Invalid article ID",
            });
        }

        const article = await Article.findById(id);

        if (!article) {
            return res.status(404).json({
                success: false,
                error: "Article not found",
            });
        }

        const imagePublicId = article.image?.publicId;

        await article.deleteOne();

        if (imagePublicId) {
            try {
                await deleteImage(imagePublicId);
            } catch (cleanupError) {
                console.error(
                    "Article deleted, but Cloudinary cleanup failed:",
                    cleanupError
                );
            }
        }

        return res.status(200).json({
            success: true,
            message: "Article deleted successfully",
        });
    } catch (error) {
        console.error("deleteArticle error:", error);

        return res.status(500).json({
            success: false,
            error: "Failed to delete article",
        });
    }
};
