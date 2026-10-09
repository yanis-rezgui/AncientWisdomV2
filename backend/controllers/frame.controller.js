
import mongoose from "mongoose";
import Frame from "../models/Learn/frame.model.js";
import HistoricalEra from "../models/Learn/era.model.js";
import { uploadImage, deleteImage } from "../utils/cloudinary.js";

const escapeRegex = (value) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const validateText = (value, minLength, maxLength) => {
    return (
        typeof value === "string" &&
        value.trim().length >= minLength &&
        value.trim().length <= maxLength
    );
};

const validTypes = ["Monument", "Statue", "Map"];

/* =========================================================
   GET ALL FRAMES
   GET /api/v1/frames?page=1&limit=12
========================================================= */
export const getFrames = async (req, res, next) => {
    try {
        // Pagination
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(
            100,
            Math.max(1, parseInt(req.query.limit, 10) || 12)
        );

        const skip = (page - 1) * limit;

        // Fetch frames and total count
        const [frames, totalFrames] = await Promise.all([
            Frame.find()
                .populate("era", "name startYear endYear")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            Frame.countDocuments(),
        ]);

        const totalPages = Math.ceil(totalFrames / limit);

        return res.status(200).json({
            success: true,
            message: "Frames retrieved successfully",
            data: frames,
            pagination: {
                currentPage: page,
                limit,
                totalFrames,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        });
    } catch (error) {
        next(error);
    }
};

/* =========================================================
   GET ONE FRAME
   GET /api/v1/frames/:id
========================================================= */
export const getFrame = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ID
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid frame ID",
            });
        }

        // Find frame
        const frame = await Frame.findById(id)
            .populate("era", "name startYear endYear description")
            .lean();

        if (!frame) {
            return res.status(404).json({
                success: false,
                message: "Frame not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Frame retrieved successfully",
            data: frame,
        });
    } catch (error) {
        next(error);
    }
};

/* =========================================================
   CREATE FRAME
   POST /api/v1/frames
========================================================= */
export const addFrame = async (req, res, next) => {
    let uploadedImage = null;

    try {
        const {
            title,
            type,
            description = "",
            era = null,
            location = "",
            source = "",
        } = req.body;

        // Validate title
        if (!validateText(title, 3, 150)) {
            return res.status(400).json({
                success: false,
                message: "Title must contain between 3 and 150 characters",
            });
        }

        // Validate type
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Type must be Monument, Statue, or Map",
            });
        }

        // Validate optional fields
        if (
            typeof description !== "string" ||
            description.length > 2000 ||
            typeof location !== "string" ||
            location.length > 200 ||
            typeof source !== "string" ||
            source.length > 500
        ) {
            return res.status(400).json({
                success: false,
                message: "One or more optional fields are invalid",
            });
        }

        // Validate era when provided
        if (era) {
            if (!mongoose.isValidObjectId(era)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid historical era ID",
                });
            }

            const existingEra = await HistoricalEra.findById(era);

            if (!existingEra) {
                return res.status(404).json({
                    success: false,
                    message: "Historical era not found",
                });
            }
        }

        // An image is required
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Frame image is required",
            });
        }

        // Upload image to Cloudinary
        uploadedImage = await uploadImage(
            req.file.buffer,
            "Ancient-Wisdom/frames"
        );

        // Create frame
        const frame = await Frame.create({
            title: title.trim(),
            type,
            description: description.trim(),
            era: era || null,
            location: location.trim(),
            source: source.trim(),
            image: {
                url: uploadedImage.url,
                publicId: uploadedImage.publicId,
            },
        });

        // Return populated frame
        const populatedFrame = await Frame.findById(frame._id)
            .populate("era", "name startYear endYear")
            .lean();

        return res.status(201).json({
            success: true,
            message: "Frame created successfully",
            data: populatedFrame,
        });
    } catch (error) {
        // Remove uploaded image if creation fails
        if (uploadedImage?.publicId) {
            try {
                await deleteImage(uploadedImage.publicId);
            } catch (cleanupError) {
                console.error(
                    "Failed to clean up uploaded frame image:",
                    cleanupError
                );
            }
        }

        next(error);
    }
};

/* =========================================================
   UPDATE FRAME
   PUT /api/v1/frames/:id
========================================================= */
export const updateFrame = async (req, res, next) => {
    let uploadedImage = null;

    try {
        const { id } = req.params;

        // Validate MongoDB ID
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid frame ID",
            });
        }

        // Find existing frame
        const existingFrame = await Frame.findById(id);

        if (!existingFrame) {
            return res.status(404).json({
                success: false,
                message: "Frame not found",
            });
        }

        const {
            title,
            type,
            description,
            era,
            location,
            source,
        } = req.body;

        const updates = {};

        // Validate and update title
        if (title !== undefined) {
            if (!validateText(title, 3, 150)) {
                return res.status(400).json({
                    success: false,
                    message: "Title must contain between 3 and 150 characters",
                });
            }

            updates.title = title.trim();
        }

        // Validate and update type
        if (type !== undefined) {
            if (!validTypes.includes(type)) {
                return res.status(400).json({
                    success: false,
                    message: "Type must be Monument, Statue, or Map",
                });
            }

            updates.type = type;
        }

        // Validate and update description
        if (description !== undefined) {
            if (
                typeof description !== "string" ||
                description.length > 2000
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Description must not exceed 2000 characters",
                });
            }

            updates.description = description.trim();
        }

        // Validate and update location
        if (location !== undefined) {
            if (typeof location !== "string" || location.length > 200) {
                return res.status(400).json({
                    success: false,
                    message: "Location must not exceed 200 characters",
                });
            }

            updates.location = location.trim();
        }

        // Validate and update source
        if (source !== undefined) {
            if (typeof source !== "string" || source.length > 500) {
                return res.status(400).json({
                    success: false,
                    message: "Source must not exceed 500 characters",
                });
            }

            updates.source = source.trim();
        }

        // Validate and update era
        if (era !== undefined) {
            if (era === "" || era === null) {
                updates.era = null;
            } else {
                if (!mongoose.isValidObjectId(era)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid historical era ID",
                    });
                }

                
                const existingEra = await HistoricalEra.findById(era);

              

                if (!existingEra) {
                    return res.status(404).json({
                        success: false,
                        message: "Historical era not found",
                    });
                }

                updates.era = era;
            }
        }

        const oldImagePublicId = existingFrame.image?.publicId;

        // Upload a new image only when provided
        if (req.file) {
            uploadedImage = await uploadImage(
                req.file.buffer,
                "Ancient-Wisdom/frames"
            );

            updates.image = {
                url: uploadedImage.url,
                publicId: uploadedImage.publicId,
            };
        }

        // No changes supplied
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No changes provided",
            });
        }

        // Save updates
        Object.assign(existingFrame, updates);
        await existingFrame.save();

        // Delete old image only after database update succeeds
        if (
            uploadedImage &&
            oldImagePublicId &&
            oldImagePublicId !== uploadedImage.publicId
        ) {
            try {
                await deleteImage(oldImagePublicId);
            } catch (cleanupError) {
                console.error(
                    "Failed to delete old frame image:",
                    cleanupError
                );
            }
        }

        const updatedFrame = await Frame.findById(id)
            .populate("era", "name startYear endYear")
            .lean();

        return res.status(200).json({
            success: true,
            message: "Frame updated successfully",
            data: updatedFrame,
        });
    } catch (error) {
        // Remove newly uploaded image if the update fails
        if (uploadedImage?.publicId) {
            try {
                await deleteImage(uploadedImage.publicId);
            } catch (cleanupError) {
                console.error(
                    "Failed to clean up uploaded frame image:",
                    cleanupError
                );
            }
        }

        next(error);
    }
};

/* =========================================================
   DELETE FRAME
   DELETE /api/v1/frames/:id
========================================================= */
export const deleteFrame = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ID
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid frame ID",
            });
        }

        // Find frame
        const frame = await Frame.findById(id);

        if (!frame) {
            return res.status(404).json({
                success: false,
                message: "Frame not found",
            });
        }

        // Delete from database
        await Frame.findByIdAndDelete(id);

        // Delete Cloudinary image
        if (frame.image?.publicId) {
            try {
                await deleteImage(frame.image.publicId);
            } catch (cloudinaryError) {
                console.error(
                    "Frame deleted from database, but Cloudinary cleanup failed:",
                    cloudinaryError
                );
            }
        }

        return res.status(200).json({
            success: true,
            message: "Frame deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
