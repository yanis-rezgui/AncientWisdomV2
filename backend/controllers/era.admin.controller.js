import mongoose from "mongoose";
import HistoricalEra from "../models/historicalEra.model.js";
import {
    uploadImage,
    deleteImage
} from "../services/cloudinary.service.js";


// ============================================================
// HELPERS
// ============================================================

const parseSections = (sections) => {

    if (sections === undefined || sections === null || sections === "") {
        return [];
    }

    let parsedSections;

    try {
        parsedSections =
            typeof sections === "string"
                ? JSON.parse(sections)
                : sections;
    } catch {
        throw new Error("Invalid sections format");
    }

    if (!Array.isArray(parsedSections)) {
        throw new Error("Sections must be an array");
    }

    if (
        !parsedSections.every(
            (section) =>
                section &&
                typeof section === "object" &&
                typeof section.title === "string" &&
                typeof section.content === "string"
        )
    ) {
        throw new Error(
            "Each section must contain a title and content"
        );
    }

    return parsedSections
        .map((section) => ({
            title: section.title.trim(),
            content: section.content.trim()
        }))
        .filter(
            (section) =>
                section.title !== "" &&
                section.content !== ""
        );
};


// ============================================================
// ADD ERA
// ============================================================

export const addEra = async (req, res, next) => {

    let uploadedImage = null;

    try {

        const {
            name,
            startYear,
            endYear,
            description,
            sections
        } = req.body;


        // ====================================================
        // NAME
        // ====================================================

        if (
            name === undefined ||
            typeof name !== "string" ||
            name.trim() === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "Era name is required"
            });
        }


        // ====================================================
        // START YEAR
        // ====================================================

        if (
            startYear === undefined ||
            startYear === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "Start year is required"
            });
        }

        const normalizedStartYear = Number(startYear);

        if (!Number.isInteger(normalizedStartYear)) {
            return res.status(400).json({
                success: false,
                message: "Start year must be an integer"
            });
        }


        // ====================================================
        // END YEAR
        // ====================================================

        if (
            endYear === undefined ||
            endYear === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "End year is required"
            });
        }

        const normalizedEndYear = Number(endYear);

        if (!Number.isInteger(normalizedEndYear)) {
            return res.status(400).json({
                success: false,
                message: "End year must be an integer"
            });
        }


        // ====================================================
        // YEAR ORDER
        // ====================================================

        if (normalizedStartYear >= normalizedEndYear) {
            return res.status(400).json({
                success: false,
                message: "Start year must be lower than end year"
            });
        }


        // ====================================================
        // DESCRIPTION
        // ====================================================

        if (
            description === undefined ||
            typeof description !== "string" ||
            description.trim() === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "Description is required"
            });
        }


        // ====================================================
        // SECTIONS
        // ====================================================

        let normalizedSections;

        try {

            normalizedSections = parseSections(sections);

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }


        // ====================================================
        // IMAGE
        // ====================================================

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "Era image is required"
            });

        }


        // ====================================================
        // UPLOAD IMAGE
        // ====================================================

        uploadedImage = await uploadImage(
            req.file,
            "Ancient-Wisdom/eras"
        );


        // ====================================================
        // CREATE ERA
        // ====================================================

        const newEra = await HistoricalEra.create({

            name: name.trim(),

            startYear: normalizedStartYear,

            endYear: normalizedEndYear,

            description: description.trim(),

            image: {
                url: uploadedImage.url,
                publicId: uploadedImage.publicId
            },

            sections: normalizedSections

        });


        // ====================================================
        // RESPONSE
        // ====================================================

        return res.status(201).json({

            success: true,

            message: "Era created successfully",

            data: newEra

        });


    } catch (err) {

        // ====================================================
        // CLEANUP CLOUDINARY IF DATABASE CREATION FAILED
        // ====================================================

        if (uploadedImage?.publicId) {

            try {

                await deleteImage(uploadedImage.publicId);

            } catch (cloudinaryError) {

                console.error(
                    "Error deleting uploaded image after failed era creation:",
                    cloudinaryError
                );

            }

        }

        next(err);
    }
};


// ============================================================
// UPDATE ERA
// ============================================================

export const updateEra = async (req, res, next) => {

    let newUploadedImage = null;

    try {

        const eraId = req.params.id;


        // ====================================================
        // VALIDATE ID
        // ====================================================

        if (!mongoose.isValidObjectId(eraId)) {

            return res.status(400).json({
                success: false,
                message: "Invalid era ID"
            });

        }


        // ====================================================
        // FIND ERA
        // ====================================================

        const existingEra = await HistoricalEra.findById(eraId);

        if (!existingEra) {

            return res.status(404).json({
                success: false,
                message: "Era not found"
            });

        }


        const {
            name,
            startYear,
            endYear,
            description,
            sections
        } = req.body;

        const updates = {};


        // ====================================================
        // NAME
        // ====================================================

        if (name !== undefined) {

            if (
                typeof name !== "string" ||
                name.trim() === ""
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Era name is invalid"
                });

            }

            updates.name = name.trim();
        }


        // ====================================================
        // START YEAR
        // ====================================================

        if (startYear !== undefined) {

            if (startYear === "") {

                return res.status(400).json({
                    success: false,
                    message: "Start year is invalid"
                });

            }

            const normalizedStartYear = Number(startYear);

            if (!Number.isInteger(normalizedStartYear)) {

                return res.status(400).json({
                    success: false,
                    message: "Start year must be an integer"
                });

            }

            updates.startYear = normalizedStartYear;
        }


        // ====================================================
        // END YEAR
        // ====================================================

        if (endYear !== undefined) {

            if (endYear === "") {

                return res.status(400).json({
                    success: false,
                    message: "End year is invalid"
                });

            }

            const normalizedEndYear = Number(endYear);

            if (!Number.isInteger(normalizedEndYear)) {

                return res.status(400).json({
                    success: false,
                    message: "End year must be an integer"
                });

            }

            updates.endYear = normalizedEndYear;
        }


        // ====================================================
        // VALIDATE YEAR RELATION
        // ====================================================

        const finalStartYear =
            updates.startYear !== undefined
                ? updates.startYear
                : existingEra.startYear;

        const finalEndYear =
            updates.endYear !== undefined
                ? updates.endYear
                : existingEra.endYear;


        if (finalStartYear >= finalEndYear) {

            return res.status(400).json({
                success: false,
                message: "Start year must be lower than end year"
            });

        }


        // ====================================================
        // DESCRIPTION
        // ====================================================

        if (description !== undefined) {

            if (
                typeof description !== "string" ||
                description.trim() === ""
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Description is invalid"
                });

            }

            updates.description = description.trim();
        }


        // ====================================================
        // SECTIONS
        // ====================================================

        if (sections !== undefined) {

            try {

                updates.sections = parseSections(sections);

            } catch (error) {

                return res.status(400).json({
                    success: false,
                    message: error.message
                });

            }

        }


        // ====================================================
        // IMAGE
        // ====================================================

        if (req.file) {

            // -----------------------------------------------
            // 1. Upload new image
            // -----------------------------------------------

            newUploadedImage = await uploadImage(
                req.file,
                "Ancient-Wisdom/eras"
            );


            // -----------------------------------------------
            // 2. Prepare new image
            // -----------------------------------------------

            updates.image = {
                url: newUploadedImage.url,
                publicId: newUploadedImage.publicId
            };

        }


        // ====================================================
        // CHECK MODIFICATIONS
        // ====================================================

        if (Object.keys(updates).length === 0) {

            return res.status(400).json({
                success: false,
                message: "No modifications provided"
            });

        }


        // ====================================================
        // UPDATE DATABASE
        // ====================================================

        const updatedEra = await HistoricalEra.findByIdAndUpdate(
            eraId,
            updates,
            {
                new: true,
                runValidators: true
            }
        );


        // ====================================================
        // DELETE OLD IMAGE
        // ONLY AFTER DATABASE UPDATE SUCCESS
        // ====================================================

        if (
            newUploadedImage &&
            existingEra.image?.publicId
        ) {

            try {

                await deleteImage(
                    existingEra.image.publicId
                );

            } catch (cloudinaryError) {

                console.error(
                    "Error deleting old era image:",
                    cloudinaryError
                );

            }

        }


        // ====================================================
        // RESPONSE
        // ====================================================

        return res.status(200).json({

            success: true,

            message: "Era updated successfully",

            data: updatedEra

        });


    } catch (err) {

        // ====================================================
        // CLEANUP NEW IMAGE IF UPDATE FAILED
        // ====================================================

        if (newUploadedImage?.publicId) {

            try {

                await deleteImage(
                    newUploadedImage.publicId
                );

            } catch (cloudinaryError) {

                console.error(
                    "Error deleting new uploaded image:",
                    cloudinaryError
                );

            }

        }

        next(err);
    }
};


// ============================================================
// DELETE ERA
// ============================================================

export const deleteEra = async (req, res, next) => {

    try {

        const eraId = req.params.id;


        // ====================================================
        // VALIDATE ID
        // ====================================================

        if (!mongoose.isValidObjectId(eraId)) {

            return res.status(400).json({
                success: false,
                message: "Invalid era ID"
            });

        }


        // ====================================================
        // FIND ERA
        // ====================================================

        const existingEra = await HistoricalEra.findById(eraId);

        if (!existingEra) {

            return res.status(404).json({
                success: false,
                message: "Era not found"
            });

        }


        // ====================================================
        // DELETE CLOUDINARY IMAGE
        // ====================================================

        if (existingEra.image?.publicId) {

            await deleteImage(
                existingEra.image.publicId
            );

        }


        // ====================================================
        // DELETE DATABASE DOCUMENT
        // ====================================================

        await HistoricalEra.findByIdAndDelete(eraId);


        // ====================================================
        // RESPONSE
        // ====================================================

        return res.status(200).json({

            success: true,

            message: "Era deleted successfully"

        });

    } catch (err) {

        next(err);

    }
};

