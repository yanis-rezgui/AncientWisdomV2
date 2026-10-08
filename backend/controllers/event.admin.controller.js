import mongoose from "mongoose";

import Event from "../models/event.model.js";
import HistoricalEra from "../models/historicalEra.model.js";


// ============================================================
// PARSE SECTIONS
// ============================================================

const parseSections = (sections) => {

    if (
        sections === undefined ||
        sections === null ||
        sections === ""
    ) {
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

        throw new Error(
            "Sections must be an array"
        );

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
// VALIDATE ERA
// ============================================================

const validateEra = async (eraId) => {

    if (!mongoose.isValidObjectId(eraId)) {

        throw new Error(
            "Invalid historical era ID"
        );

    }


    const era =
        await HistoricalEra
            .findById(eraId)
            .select("_id");


    if (!era) {

        throw new Error(
            "Historical era does not exist"
        );

    }


    return true;

};


// ============================================================
// ADD EVENT
// ============================================================

export const addEvent = async (req, res, next) => {

    try {

        const {
            name,
            startDate,
            endDate,
            location,
            era,
            description,
            sections,
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
                message: "Event name is required"
            });

        }


        // ====================================================
        // START DATE
        // ====================================================

        if (
            startDate === undefined ||
            typeof startDate !== "string" ||
            startDate.trim() === ""
        ) {

            return res.status(400).json({
                success: false,
                message: "Event start date is required"
            });

        }


        // ====================================================
        // END DATE
        // ====================================================

        if (
            endDate === undefined ||
            typeof endDate !== "string" ||
            endDate.trim() === ""
        ) {

            return res.status(400).json({
                success: false,
                message: "Event end date is required"
            });

        }


        // ====================================================
        // LOCATION
        // ====================================================

        if (
            location === undefined ||
            typeof location !== "string" ||
            location.trim() === ""
        ) {

            return res.status(400).json({
                success: false,
                message: "Event location is required"
            });

        }


        // ====================================================
        // ERA
        // ====================================================

        if (
            era === undefined ||
            typeof era !== "string" ||
            era.trim() === ""
        ) {

            return res.status(400).json({
                success: false,
                message: "Historical era is required"
            });

        }


        try {

            await validateEra(
                era.trim()
            );

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }


        // ====================================================
        // DESCRIPTION
        // ====================================================

        let normalizedDescription = undefined;


        if (description !== undefined) {

            if (
                typeof description !== "string"
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Event description is invalid"
                });

            }


            normalizedDescription =
                description.trim();

        }


        // ====================================================
        // SECTIONS
        // ====================================================

        let normalizedSections;

        try {

            normalizedSections =
                parseSections(sections);

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

            normalizedTags =
                parseTags(tags);

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }


        // ====================================================
        // CREATE EVENT
        // ====================================================

        const newEvent = await Event.create({

            name: name.trim(),

            startDate:
                startDate.trim(),

            endDate:
                endDate.trim(),

            location:
                location.trim(),

            era:
                era.trim(),

            ...(normalizedDescription !== undefined && {
                description:
                    normalizedDescription
            }),

            sections:
                normalizedSections,

            tags:
                normalizedTags

        });


        // ====================================================
        // RESPONSE
        // ====================================================

        return res.status(201).json({

            success: true,

            message: "Event created successfully",

            data: newEvent

        });

    } catch (err) {

        next(err);

    }

};


// ============================================================
// UPDATE EVENT
// ============================================================

export const updateEvent = async (req, res, next) => {

    try {

        const eventId = req.params.id;


        // ====================================================
        // VALIDATE ID
        // ====================================================

        if (!mongoose.isValidObjectId(eventId)) {

            return res.status(400).json({
                success: false,
                message: "Invalid event ID"
            });

        }


        // ====================================================
        // FIND EVENT
        // ====================================================

        const existingEvent =
            await Event.findById(eventId);


        if (!existingEvent) {

            return res.status(404).json({
                success: false,
                message: "Event not found"
            });

        }


        const {
            name,
            startDate,
            endDate,
            location,
            era,
            description,
            sections,
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
                    message: "Event name is invalid"
                });

            }


            updates.name =
                name.trim();

        }


        // ====================================================
        // START DATE
        // ====================================================

        if (startDate !== undefined) {

            if (
                typeof startDate !== "string" ||
                startDate.trim() === ""
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Event start date is invalid"
                });

            }


            updates.startDate =
                startDate.trim();

        }


        // ====================================================
        // END DATE
        // ====================================================

        if (endDate !== undefined) {

            if (
                typeof endDate !== "string" ||
                endDate.trim() === ""
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Event end date is invalid"
                });

            }


            updates.endDate =
                endDate.trim();

        }


        // ====================================================
        // LOCATION
        // ====================================================

        if (location !== undefined) {

            if (
                typeof location !== "string" ||
                location.trim() === ""
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Event location is invalid"
                });

            }


            updates.location =
                location.trim();

        }


        // ====================================================
        // ERA
        // ====================================================

        if (era !== undefined) {

            if (
                typeof era !== "string" ||
                era.trim() === ""
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Historical era is invalid"
                });

            }


            try {

                await validateEra(
                    era.trim()
                );

            } catch (error) {

                return res.status(400).json({
                    success: false,
                    message: error.message
                });

            }


            updates.era =
                era.trim();

        }


        // ====================================================
        // DESCRIPTION
        // ====================================================

        if (description !== undefined) {

            if (
                typeof description !== "string"
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Event description is invalid"
                });

            }


            updates.description =
                description.trim();

        }


        // ====================================================
        // SECTIONS
        // ====================================================

        if (sections !== undefined) {

            try {

                updates.sections =
                    parseSections(
                        sections
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
                    parseTags(
                        tags
                    );

            } catch (error) {

                return res.status(400).json({
                    success: false,
                    message: error.message
                });

            }

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

        const updatedEvent =
            await Event.findByIdAndUpdate(
                eventId,
                updates,
                {
                    new: true,
                    runValidators: true
                }
            );


        // ====================================================
        // RESPONSE
        // ====================================================

        return res.status(200).json({

            success: true,

            message: "Event updated successfully",

            data: updatedEvent

        });

    } catch (err) {

        next(err);

    }

};


// ============================================================
// DELETE EVENT
// ============================================================

export const deleteEvent = async (req, res, next) => {

    try {

        const eventId = req.params.id;


        // ====================================================
        // VALIDATE ID
        // ====================================================

        if (!mongoose.isValidObjectId(eventId)) {

            return res.status(400).json({
                success: false,
                message: "Invalid event ID"
            });

        }


        // ====================================================
        // FIND EVENT
        // ====================================================

        const existingEvent =
            await Event.findById(eventId);


        if (!existingEvent) {

            return res.status(404).json({
                success: false,
                message: "Event not found"
            });

        }


        // ====================================================
        // DELETE DATABASE DOCUMENT
        // ====================================================

        await Event.findByIdAndDelete(
            eventId
        );


        // ====================================================
        // RESPONSE
        // ====================================================

        return res.status(200).json({

            success: true,

            message: "Event deleted successfully"

        });

    } catch (err) {

        next(err);

    }

};

