// controllers/movie.controller.js

import mongoose from "mongoose";
import Movie from "../models/Learn/movie.model.js";
import HistoricalEra from "../models/historicalEra.model.js";
import {
    uploadImage,
    deleteImage,
} from "../services/cloudinary.service.js";

const escapeRegex = (value) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const validateText = (value, field, minLength, maxLength) => {
    if (typeof value !== "string") {
        throw new Error(`${field} must be a string`);
    }

    const trimmedValue = value.trim();

    if (trimmedValue.length < minLength) {
        throw new Error(`${field} must contain at least ${minLength} character(s)`);
    }

    if (trimmedValue.length > maxLength) {
        throw new Error(`${field} cannot exceed ${maxLength} characters`);
    }

    return trimmedValue;
};

const validateEra = async (eraId) => {
    if (eraId === null || eraId === "") {
        return null;
    }

    if (!mongoose.isValidObjectId(eraId)) {
        throw new Error("Invalid historical era ID");
    }

    const eraExists = await HistoricalEra.exists({ _id: eraId });

    if (!eraExists) {
        throw new Error("Historical era not found");
    }

    return eraId;
};

// ============================================================
// GET ALL MOVIES
// GET /api/v1/movies?page=1&limit=10&search=...
// ============================================================

export const getMovies = async (req, res) => {
    try {
        const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
        const limit = Math.min(
            100,
            Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
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
            }).select("_id");

            filter.$or = [
                { title: regex },
                { description: regex },
                { era: { $in: matchingEras.map((era) => era._id) } },
            ];
        }

        const [movies, total] = await Promise.all([
            Movie.find(filter)
                .populate("era", "name startYear endYear")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Movie.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            data: movies,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("getMovies error:", error);

        return res.status(500).json({
            success: false,
            error: "Failed to fetch movies",
        });
    }
};

// ============================================================
// GET ONE MOVIE
// GET /api/v1/movies/:id
// ============================================================

export const getMovie = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: "Invalid movie ID",
            });
        }

        const movie = await Movie.findById(id).populate(
            "era",
            "name startYear endYear description"
        );

        if (!movie) {
            return res.status(404).json({
                success: false,
                error: "Movie not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: movie,
        });
    } catch (error) {
        console.error("getMovie error:", error);

        return res.status(500).json({
            success: false,
            error: "Failed to fetch movie",
        });
    }
};

// ============================================================
// ADD MOVIE
// POST /api/v1/movies
// ============================================================

export const addMovie = async (req, res) => {
    let uploadedImage = null;

    try {
        const title = validateText(req.body.title, "Title", 1, 150);
        const description = validateText(
            req.body.description,
            "Description",
            1,
            4000
        );

        const era = await validateEra(req.body.era ?? null);

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "Movie image is required",
            });
        }

        uploadedImage = await uploadImage(
            req.file,
            "Ancient-Wisdom/movies"
        );

        const movie = await Movie.create({
            title,
            description,
            era,
            image: {
                url: uploadedImage.url,
                publicId: uploadedImage.publicId,
            },
        });

        const populatedMovie = await Movie.findById(movie._id).populate(
            "era",
            "name startYear endYear"
        );

        return res.status(201).json({
            success: true,
            message: "Movie created successfully",
            data: populatedMovie,
        });
    } catch (error) {
        if (uploadedImage?.publicId) {
            try {
                await deleteImage(uploadedImage.publicId);
            } catch (cleanupError) {
                console.error("Cloudinary cleanup error:", cleanupError);
            }
        }

        console.error("addMovie error:", error);

        const isValidationError =
            error instanceof Error &&
            (
                error.message.includes("Title") ||
                error.message.includes("Description") ||
                error.message.includes("era") ||
                error.message.includes("historical")
            );

        return res.status(isValidationError ? 400 : 500).json({
            success: false,
            error: error instanceof Error
                ? error.message
                : "Failed to create movie",
        });
    }
};

// ============================================================
// UPDATE MOVIE
// PUT /api/v1/movies/:id
// ============================================================

export const updateMovie = async (req, res) => {
    let uploadedImage = null;

    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: "Invalid movie ID",
            });
        }

        const movie = await Movie.findById(id);

        if (!movie) {
            return res.status(404).json({
                success: false,
                error: "Movie not found",
            });
        }

        const updates = {};

        if (req.body.title !== undefined) {
            updates.title = validateText(
                req.body.title,
                "Title",
                1,
                150
            );
        }

        if (req.body.description !== undefined) {
            updates.description = validateText(
                req.body.description,
                "Description",
                1,
                4000
            );
        }

        if (req.body.era !== undefined) {
            updates.era = await validateEra(req.body.era);
        }

        if (req.file) {
            uploadedImage = await uploadImage(
                req.file,
                "Ancient-Wisdom/movies"
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

        const oldImagePublicId = movie.image?.publicId;

        Object.assign(movie, updates);
        await movie.save();

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
                    "Failed to delete previous movie image:",
                    cleanupError
                );
            }
        }

        const updatedMovie = await Movie.findById(id).populate(
            "era",
            "name startYear endYear"
        );

        return res.status(200).json({
            success: true,
            message: "Movie updated successfully",
            data: updatedMovie,
        });
    } catch (error) {
        // Remove the new image if the database update failed.
        if (uploadedImage?.publicId) {
            try {
                await deleteImage(uploadedImage.publicId);
            } catch (cleanupError) {
                console.error("Cloudinary cleanup error:", cleanupError);
            }
        }

        console.error("updateMovie error:", error);

        const isValidationError =
            error instanceof Error &&
            (
                error.message.includes("Title") ||
                error.message.includes("Description") ||
                error.message.includes("era") ||
                error.message.includes("historical")
            );

        return res.status(isValidationError ? 400 : 500).json({
            success: false,
            error: error instanceof Error
                ? error.message
                : "Failed to update movie",
        });
    }
};

// ============================================================
// DELETE MOVIE
// DELETE /api/v1/movies/:id
// ============================================================

export const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: "Invalid movie ID",
            });
        }

        const movie = await Movie.findById(id);

        if (!movie) {
            return res.status(404).json({
                success: false,
                error: "Movie not found",
            });
        }

        const imagePublicId = movie.image?.publicId;

        await movie.deleteOne();

        if (imagePublicId) {
            try {
                await deleteImage(imagePublicId);
            } catch (cleanupError) {
                // The database deletion succeeded, even if Cloudinary cleanup fails.
                console.error(
                    "Failed to delete movie image from Cloudinary:",
                    cleanupError
                );
            }
        }

        return res.status(200).json({
            success: true,
            message: "Movie deleted successfully",
        });
    } catch (error) {
        console.error("deleteMovie error:", error);

        return res.status(500).json({
            success: false,
            error: "Failed to delete movie",
        });
    }
};