import mongoose from "mongoose";

import Figure from "../models/historicalFigure.model.js";
import HistoricalEra from "../models/historicalEra.model.js";

import {
    uploadImage,
    deleteImage
} from "../services/cloudinary.service.js";


// ============================================================
// HELPERS
// ============================================================


// ============================================================
// PARSE BIOGRAPHY
// ============================================================

const parseBiography = (biography) => {

    if (
        biography === undefined ||
        biography === null ||
        biography === ""
    ) {
        return [];
    }

    let parsedBiography;

    try {

        parsedBiography =
            typeof biography === "string"
                ? JSON.parse(biography)
                : biography;

    } catch {

        throw new Error("Invalid biography format");

    }


    if (!Array.isArray(parsedBiography)) {

        throw new Error(
            "Biography must be an array"
        );

    }


    if (
        !parsedBiography.every(
            (section) =>
                section &&
                typeof section === "object" &&
                typeof section.title === "string" &&
                typeof section.content === "string"
        )
    ) {

        throw new Error(
            "Each biography section must contain a title and content"
        );

    }


    return parsedBiography
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
// PARSE ERAS
// ============================================================

const parseEras = (eras) => {

    if (
        eras === undefined ||
        eras === null ||
        eras === ""
    ) {
        return [];
    }


    let parsedEras;

    try {

        parsedEras =
            typeof eras === "string"
                ? JSON.parse(eras)
                : eras;

    } catch {

        throw new Error("Invalid eras format");

    }


    if (!Array.isArray(parsedEras)) {

        throw new Error(
            "Eras must be an array"
        );

    }


    const normalizedEras = parsedEras
        .map((era) => {

            if (
                typeof era !== "string" ||
                !mongoose.isValidObjectId(era)
            ) {
                return null;
            }

            return era;

        })
        .filter(Boolean);


    if (normalizedEras.length === 0) {

        throw new Error(
            "At least one valid historical era is required"
        );

    }


    // Remove duplicates
    return [
        ...new Set(
            normalizedEras.map(
                (era) => era.toString()
            )
        )
    ];

};


// ============================================================
// PARSE TAGS
// ============================================================

const parseTags = (tags) => {

    if (
        tags === undefined ||
        tags === null ||
        tags === ""
    ) {
        return [];
    }


    let parsedTags;


    try {

        parsedTags =
            typeof tags === "string"
                ? JSON.parse(tags)
                : tags;

    } catch {

        throw new Error("Invalid tags format");

    }


    if (!Array.isArray(parsedTags)) {

        throw new Error(
            "Tags must be an array"
        );

    }


    return parsedTags
        .filter(
            (tag) =>
                typeof tag === "string"
        )
        .map(
            (tag) =>
                tag.trim()
        )
        .filter(
            (tag) =>
                tag !== ""
        );

};


// ============================================================
// VALIDATE ERAS EXISTENCE
// ============================================================

const validateEras = async (eraIds) => {

    const eras = await HistoricalEra.find({
        _id: {
            $in: eraIds
        }
    }).select("_id");


    if (eras.length !== eraIds.length) {

        throw new Error(
            "One or more historical eras do not exist"
        );

    }


    return true;

};


// ============================================================
// ADD FIGURE
// ============================================================

export const addFigure = async (req, res, next) => {

    let uploadedImage = null;


    try {

        const {
            name,
            birthDate,
            birthPlace,
            deathDate,
            deathPlace,
            eras,
            biography,
            tags
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
                message: "Figure name is required"
            });

        }


        // ====================================================
        // BIRTH DATE
        // ====================================================

        if (
            birthDate === undefined ||
            typeof birthDate !== "string" ||
            birthDate.trim() === ""
        ) {

            return res.status(400).json({
                success: false,
                message: "Birth date is required"
            });

        }


        // ====================================================
        // BIRTH PLACE
        // ====================================================

        if (
            birthPlace === undefined ||
            typeof birthPlace !== "string" ||
            birthPlace.trim() === ""
        ) {

            return res.status(400).json({
                success: false,
                message: "Birth place is required"
            });

        }


        // ====================================================
        // DEATH DATE
        // ====================================================

        if (
            deathDate === undefined ||
            typeof deathDate !== "string" ||
            deathDate.trim() === ""
        ) {

            return res.status(400).json({
                success: false,
                message: "Death date is required"
            });

        }


        // ====================================================
        // DEATH PLACE
        // ====================================================

        if (
            deathPlace === undefined ||
            typeof deathPlace !== "string" ||
            deathPlace.trim() === ""
        ) {

            return res.status(400).json({
                success: false,
                message: "Death place is required"
            });

        }


        // ====================================================
        // ERAS
        // ====================================================

        let normalizedEras;

        try {

            normalizedEras = parseEras(eras);

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }


        try {

            await validateEras(normalizedEras);

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }


        // ====================================================
        // BIOGRAPHY
        // ====================================================

        let normalizedBiography;

        try {

            normalizedBiography =
                parseBiography(biography);

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }


        // ====================================================
        // TAGS
        // ====================================================

        let normalizedTags;

        try {

            normalizedTags = parseTags(tags);

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
                message: "Figure image is required"
            });

        }


        // ====================================================
        // UPLOAD IMAGE
        // ====================================================

        uploadedImage = await uploadImage(
            req.file,
            "Ancient-Wisdom/figures"
        );


        // ====================================================
        // CREATE FIGURE
        // ====================================================

        const newFigure = await Figure.create({

            name: name.trim(),

            birthDate: birthDate.trim(),

            birthPlace: birthPlace.trim(),

            deathDate: deathDate.trim(),

            deathPlace: deathPlace.trim(),

            eras: normalizedEras,

            biography: normalizedBiography,

            image: {
                url: uploadedImage.url,
                publicId: uploadedImage.publicId
            },

            tags: normalizedTags

        });


        // ====================================================
        // RESPONSE
        // ====================================================

        return res.status(201).json({

            success: true,

            message: "Figure created successfully",

            data: newFigure

        });


    } catch (err) {


        // ====================================================
        // CLEANUP CLOUDINARY IF DATABASE CREATION FAILED
        // ====================================================

        if (uploadedImage?.publicId) {

            try {

                await deleteImage(
                    uploadedImage.publicId
                );

            } catch (cloudinaryError) {

                console.error(
                    "Error deleting uploaded figure image after failed creation:",
                    cloudinaryError
                );

            }

        }


        next(err);

    }

};


// ============================================================
// UPDATE FIGURE
// ============================================================

export const updateFigure = async (req, res, next) => {

    let newUploadedImage = null;


    try {

        const figureId = req.params.id;


        // ====================================================
        // VALIDATE ID
        // ====================================================

        if (!mongoose.isValidObjectId(figureId)) {

            return res.status(400).json({
                success: false,
                message: "Invalid figure ID"
            });

        }


        // ====================================================
        // FIND FIGURE
        // ====================================================

        const existingFigure =
            await Figure.findById(figureId);


        if (!existingFigure) {

            return res.status(404).json({
                success: false,
                message: "Figure not found"
            });

        }


        const {
            name,
            birthDate,
            birthPlace,
            deathDate,
            deathPlace,
            eras,
            biography,
            tags
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
                    message: "Figure name is invalid"
                });

            }

            updates.name = name.trim();

        }


        // ====================================================
        // BIRTH DATE
        // ====================================================

        if (birthDate !== undefined) {

            if (
                typeof birthDate !== "string" ||
                birthDate.trim() === ""
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Birth date is invalid"
                });

            }

            updates.birthDate =
                birthDate.trim();

        }


        // ====================================================
        // BIRTH PLACE
        // ====================================================

        if (birthPlace !== undefined) {

            if (
                typeof birthPlace !== "string" ||
                birthPlace.trim() === ""
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Birth place is invalid"
                });

            }

            updates.birthPlace =
                birthPlace.trim();

        }


        // ====================================================
        // DEATH DATE
        // ====================================================

        if (deathDate !== undefined) {

            if (
                typeof deathDate !== "string" ||
                deathDate.trim() === ""
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Death date is invalid"
                });

            }

            updates.deathDate =
                deathDate.trim();

        }


        // ====================================================
        // DEATH PLACE
        // ====================================================

        if (deathPlace !== undefined) {

            if (
                typeof deathPlace !== "string" ||
                deathPlace.trim() === ""
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Death place is invalid"
                });

            }

            updates.deathPlace =
                deathPlace.trim();

        }


        // ====================================================
        // ERAS
        // ====================================================

        if (eras !== undefined) {

            let normalizedEras;

            try {

                normalizedEras =
                    parseEras(eras);

            } catch (error) {

                return res.status(400).json({
                    success: false,
                    message: error.message
                });

            }


            try {

                await validateEras(
                    normalizedEras
                );

            } catch (error) {

                return res.status(400).json({
                    success: false,
                    message: error.message
                });

            }


            updates.eras =
                normalizedEras;

        }


        // ====================================================
        // BIOGRAPHY
        // ====================================================

        if (biography !== undefined) {

            try {

                updates.biography =
                    parseBiography(
                        biography
                    );

            } catch (error) {

                return res.status(400).json({
                    success: false,
                    message: error.message
                });

            }

        }


        // ====================================================
        // TAGS
        // ====================================================

        if (tags !== undefined) {

            try {

                updates.tags =
                    parseTags(tags);

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

            newUploadedImage =
                await uploadImage(
                    req.file,
                    "Ancient-Wisdom/figures"
                );


            // -----------------------------------------------
            // 2. Prepare new image
            // -----------------------------------------------

            updates.image = {

                url: newUploadedImage.url,

                publicId:
                    newUploadedImage.publicId

            };

        }


        // ====================================================
        // CHECK MODIFICATIONS
        // ====================================================

        if (
            Object.keys(updates).length === 0
        ) {

            return res.status(400).json({
                success: false,
                message: "No modifications provided"
            });

        }


        // ====================================================
        // UPDATE DATABASE
        // ====================================================

        const updatedFigure =
            await Figure.findByIdAndUpdate(
                figureId,
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
            existingFigure.image?.publicId
        ) {

            try {

                await deleteImage(
                    existingFigure.image.publicId
                );

            } catch (cloudinaryError) {

                console.error(
                    "Error deleting old figure image:",
                    cloudinaryError
                );

            }

        }


        // ====================================================
        // RESPONSE
        // ====================================================

        return res.status(200).json({

            success: true,

            message: "Figure updated successfully",

            data: updatedFigure

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
                    "Error deleting new figure image:",
                    cloudinaryError
                );

            }

        }


        next(err);

    }

};


// ============================================================
// DELETE FIGURE
// ============================================================

export const deleteFigure = async (req, res, next) => {

    try {

        const figureId = req.params.id;


        // ====================================================
        // VALIDATE ID
        // ====================================================

        if (!mongoose.isValidObjectId(figureId)) {

            return res.status(400).json({
                success: false,
                message: "Invalid figure ID"
            });

        }


        // ====================================================
        // FIND FIGURE
        // ====================================================

        const existingFigure =
            await Figure.findById(figureId);


        if (!existingFigure) {

            return res.status(404).json({
                success: false,
                message: "Figure not found"
            });

        }


        // ====================================================
        // DELETE CLOUDINARY IMAGE
        // ====================================================

        if (existingFigure.image?.publicId) {

            await deleteImage(
                existingFigure.image.publicId
            );

        }


        // ====================================================
        // DELETE DATABASE DOCUMENT
        // ====================================================

        await Figure.findByIdAndDelete(
            figureId
        );


        // ====================================================
        // RESPONSE
        // ====================================================

        return res.status(200).json({

            success: true,

            message: "Figure deleted successfully"

        });

    } catch (err) {

        next(err);

    }

};