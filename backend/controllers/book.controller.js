
import mongoose from "mongoose";

import Book from "../models/Learn/book.model.js";
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

const validateBookText = (value, field, maxLength) => {
    if (
        typeof value !== "string" ||
        value.trim().length < 1 ||
        value.trim().length > maxLength
    ) {
        return `${field} must contain between 1 and ${maxLength} characters`;
    }

    return null;
};

const validateEra = async (eraId) => {
    if (!mongoose.isValidObjectId(eraId)) {
        return false;
    }

    return Boolean(await HistoricalEra.exists({ _id: eraId }));
};

// ============================================================
// GET BOOKS — SEARCH + PAGINATION
// ============================================================

export const getBooks = async (req, res, next) => {
    try {
        const {
            search = "",
            page = 1,
            limit = 10,
        } = req.query;

        const pageNumber = Math.max(
            Number.isInteger(Number(page)) ? Number(page) : 1,
            1
        );

        const limitNumber = Math.min(
            Math.max(
                Number.isInteger(Number(limit)) ? Number(limit) : 10,
                1
            ),
            100
        );

        const filters = {};

        if (typeof search === "string" && search.trim()) {
            const regex = {
                $regex: escapeRegex(search.trim()),
                $options: "i",
            };

            // Search by historical era name as well.
            const matchingEras = await HistoricalEra.find({
                name: regex,
            }).select("_id").lean();

            filters.$or = [
                { title: regex },
                { author: regex },
                { description: regex },
                {
                    era: {
                        $in: matchingEras.map((era) => era._id),
                    },
                },
            ];
        }

        const skip = (pageNumber - 1) * limitNumber;

        const [books, total] = await Promise.all([
            Book.find(filters)
                .populate("era", "name startYear endYear")
                .sort({ title: 1 })
                .skip(skip)
                .limit(limitNumber)
                .lean(),

            Book.countDocuments(filters),
        ]);

        return res.status(200).json({
            success: true,
            message: "Books fetched successfully",
            data: books,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages: Math.ceil(total / limitNumber),
            },
        });
    } catch (err) {
        next(err);
    }
};

// ============================================================
// GET BOOK BY ID
// ============================================================

export const getBook = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid book ID",
            });
        }

        const book = await Book.findById(id)
            .populate("era", "name startYear endYear description")
            .lean();

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Book fetched successfully",
            data: book,
        });
    } catch (err) {
        next(err);
    }
};

// ============================================================
// ADD BOOK
// ============================================================

export const addBook = async (req, res, next) => {
    let uploadedImage = null;

    try {
        const {
            title,
            author,
            description,
            era,
        } = req.body;

        // ----------------------------------------------------
        // VALIDATE TITLE
        // ----------------------------------------------------

        const titleError = validateBookText(title, "Title", 150);

        if (titleError) {
            return res.status(400).json({
                success: false,
                message: titleError,
            });
        }

        // ----------------------------------------------------
        // VALIDATE AUTHOR
        // ----------------------------------------------------

        const authorError = validateBookText(author, "Author", 150);

        if (authorError) {
            return res.status(400).json({
                success: false,
                message: authorError,
            });
        }

        // ----------------------------------------------------
        // VALIDATE DESCRIPTION
        // ----------------------------------------------------

        const descriptionError = validateBookText(
            description,
            "Description",
            4000
        );

        if (descriptionError) {
            return res.status(400).json({
                success: false,
                message: descriptionError,
            });
        }

        // ----------------------------------------------------
        // VALIDATE ERA
        // ----------------------------------------------------

        if (!era) {
            return res.status(400).json({
                success: false,
                message: "Historical era is required",
            });
        }

        if (!(await validateEra(era))) {
            return res.status(400).json({
                success: false,
                message: "Invalid historical era",
            });
        }

        // ----------------------------------------------------
        // VALIDATE IMAGE
        // ----------------------------------------------------

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Book cover image is required",
            });
        }

        // ----------------------------------------------------
        // UPLOAD IMAGE
        // ----------------------------------------------------

        uploadedImage = await uploadImage(
            req.file,
            "Ancient-Wisdom/books"
        );

        // ----------------------------------------------------
        // CREATE BOOK
        // ----------------------------------------------------

        const book = await Book.create({
            title: title.trim(),
            author: author.trim(),
            description: description.trim(),
            era,
            image: {
                url: uploadedImage.url,
                publicId: uploadedImage.publicId,
            },
        });

        const populatedBook = await Book.findById(book._id)
            .populate("era", "name startYear endYear")
            .lean();

        return res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: populatedBook,
        });
    } catch (err) {
        // Remove uploaded image if creation failed.
        if (uploadedImage?.publicId) {
            try {
                await deleteImage(uploadedImage.publicId);
            } catch (cloudinaryError) {
                console.error(
                    "Error cleaning up book cover:",
                    cloudinaryError
                );
            }
        }

        next(err);
    }
};

// ============================================================
// UPDATE BOOK
// ============================================================

export const updateBook = async (req, res, next) => {
    let newUploadedImage = null;

    try {
        const { id } = req.params;

        // ----------------------------------------------------
        // VALIDATE ID
        // ----------------------------------------------------

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid book ID",
            });
        }

        // ----------------------------------------------------
        // FIND BOOK
        // ----------------------------------------------------

        const existingBook = await Book.findById(id);

        if (!existingBook) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        const {
            title,
            author,
            description,
            era,
        } = req.body;

        const updates = {};

        // ----------------------------------------------------
        // TITLE
        // ----------------------------------------------------

        if (title !== undefined) {
            const error = validateBookText(title, "Title", 150);

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error,
                });
            }

            updates.title = title.trim();
        }

        // ----------------------------------------------------
        // AUTHOR
        // ----------------------------------------------------

        if (author !== undefined) {
            const error = validateBookText(author, "Author", 150);

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error,
                });
            }

            updates.author = author.trim();
        }

        // ----------------------------------------------------
        // DESCRIPTION
        // ----------------------------------------------------

        if (description !== undefined) {
            const error = validateBookText(
                description,
                "Description",
                4000
            );

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error,
                });
            }

            updates.description = description.trim();
        }

        // ----------------------------------------------------
        // ERA
        // ----------------------------------------------------

        if (era !== undefined) {
            if (!(await validateEra(era))) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid historical era",
                });
            }

            updates.era = era;
        }

        // ----------------------------------------------------
        // IMAGE
        // ----------------------------------------------------

        if (req.file) {
            newUploadedImage = await uploadImage(
                req.file,
                "Ancient-Wisdom/books"
            );

            updates.image = {
                url: newUploadedImage.url,
                publicId: newUploadedImage.publicId,
            };
        }

        // ----------------------------------------------------
        // CHECK MODIFICATIONS
        // ----------------------------------------------------

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No modifications provided",
            });
        }

        // ----------------------------------------------------
        // UPDATE DATABASE
        // ----------------------------------------------------

        const updatedBook = await Book.findByIdAndUpdate(
            id,
            updates,
            {
                new: true,
                runValidators: true,
            }
        ).populate("era", "name startYear endYear");

        // ----------------------------------------------------
        // DELETE OLD IMAGE AFTER SUCCESSFUL UPDATE
        // ----------------------------------------------------

        if (
            newUploadedImage &&
            existingBook.image?.publicId
        ) {
            try {
                await deleteImage(existingBook.image.publicId);
            } catch (cloudinaryError) {
                console.error(
                    "Error deleting old book cover:",
                    cloudinaryError
                );
            }
        }

        return res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: updatedBook,
        });
    } catch (err) {
        // Clean up the new image if the update failed.
        if (newUploadedImage?.publicId) {
            try {
                await deleteImage(newUploadedImage.publicId);
            } catch (cloudinaryError) {
                console.error(
                    "Error cleaning up new book cover:",
                    cloudinaryError
                );
            }
        }

        next(err);
    }
};

// ============================================================
// DELETE BOOK
// ============================================================

export const deleteBook = async (req, res, next) => {
    try {
        const { id } = req.params;

        // ----------------------------------------------------
        // VALIDATE ID
        // ----------------------------------------------------

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid book ID",
            });
        }

        // ----------------------------------------------------
        // FIND BOOK
        // ----------------------------------------------------

        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        // ----------------------------------------------------
        // DELETE DATABASE DOCUMENT
        // ----------------------------------------------------

        await Book.findByIdAndDelete(id);

        // ----------------------------------------------------
        // DELETE CLOUDINARY IMAGE
        // ----------------------------------------------------

        if (book.image?.publicId) {
            try {
                await deleteImage(book.image.publicId);
            } catch (cloudinaryError) {
                console.error(
                    "Book deleted, but its Cloudinary image could not be deleted:",
                    cloudinaryError
                );
            }
        }

        return res.status(200).json({
            success: true,
            message: "Book deleted successfully",
        });
    } catch (err) {
        next(err);
    }
};