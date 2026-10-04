import SavedItem from "../models/savedItem.model.js";
import Quote from "../models/quote.model.js";
import Figure from "../models/historicalFigure.model.js";
import Event from "../models/event.model.js";


export const getSavedQuotes = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const savedQuotes = await SavedItem.find({
            user: userId,
            itemType: "Quote"
        })
            .populate("item")
            .sort({ createdAt: -1 })
            .lean();

        const quotes = savedQuotes.map(savedItem => savedItem.item);
        return res.status(200).json({
            success: true,
            message: "Saved quotes retrieved successfully",
            data: quotes
        });

    } catch (err) {
        next(err);
    }
};


export const getSavedFigures = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const savedFigures = await SavedItem.find({
            user: userId,
            itemType: "Figure"
        })
            .populate("item")
            .sort({ createdAt: -1 })
            .lean();

        const figures = savedFigures.map(savedItem => savedItem.item);
        return res.status(200).json({
            success: true,
            message: "Saved figures retrieved successfully",
            data: figures
        });

    } catch (err) {
        next(err);
    }
};


export const getSavedEvents = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const savedEvents = await SavedItem.find({
            user: userId,
            itemType: "Event"
        })
            .populate("item")
            .sort({ createdAt: -1 })
            .lean();

        const events = savedEvents.map(savedItem => savedItem.item);

        return res.status(200).json({
            success: true,
            message: "Saved events retrieved successfully",
            data: events
        });

    } catch (err) {
        next(err);
    }
};


export const toggleItem = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const { itemType, item } = req.body;

        const allowedTypes = ["Quote", "Figure", "Event"];

        if (!allowedTypes.includes(itemType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid item type"
            });
        }

        if (!item) {
            return res.status(400).json({
                success: false,
                message: "Item is required"
            });
        }

        const Model = {
            Quote,
            Figure,
            Event
        }[itemType];

        const itemExists = await Model.exists({
            _id: item
        });

        if (!itemExists) {
            return res.status(404).json({
                success: false,
                message: `${itemType} not found`
            });
        }

        const existingSavedItem = await SavedItem.findOne({
            user: userId,
            itemType,
            item
        });

        if (existingSavedItem) {

            await SavedItem.deleteOne({
                _id: existingSavedItem._id
            });

            return res.status(200).json({
                success: true,
                message: `${itemType} removed from saved items`,
                data: {
                    saved: false
                }
            });
        }

        await SavedItem.create({
            user: userId,
            itemType,
            item
        });

        return res.status(201).json({
            success: true,
            message: `${itemType} added to saved items`,
            data: {
                saved: true
            }
        });

    } catch (err) {
        next(err);
    }
};