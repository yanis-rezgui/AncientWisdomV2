import mongoose from "mongoose";
import Event from "../models/event.model.js";




export const getEvents = async(req, res, next) => {

    try{

        const {
            search,
            era,
            page = 1,
            limit = 10
        } = req.query;

        const filters = {};

        if(search && search.trim() !== ""){
            const searchRegex = {
                $regex: search.trim(),
                $options : "i"
            }

            filters.$or = [
                {name : searchRegex},
                {tags : searchRegex},
                {location : searchRegex},
                {description : searchRegex}
            ]
        }

        if(era && mongoose.isValidObjectId(era)){
            filters.era = era
        }

        const pageNumber = Math.max(Number(page) || 1, 1);
        const limitNumber = Math.max(Number(limit) || 10, 1);

        const skip = (pageNumber - 1) * limitNumber;

        const [events, total] = await Promise.all([
            Event.find(filters).
               populate("era").
               skip(skip).
               limit(limitNumber).
               sort({createdAt : -1}),
            
            Event.countDocuments()
        ]);

        return res.status(200).json({
            success : true,
            message : "Events fetched successfully",
            data : events,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages: Math.ceil(
                    total / limitNumber
                ),
            },
        });

    }catch(err){
        next(err);
    }
}


export const getEvent = async(req, res, next) => {

    try{

        const eventId = req.params.id;

        if(!mongoose.isValidObjectId(eventId)){
            return res.status(400).json({
                success : false,
                message : "Error invalid id"
            });
        }

        const event = await Event.findById(eventId).populate("era");

        if(!event){
            return res.status(404).json({
                success : false,
                message: "Error event not found"
            });
        }

        return res.status(200).json({
             success : true,
             message : "Event fetched successfully",
             data : event
        });
        
    }catch(err){
        next(err);
    }
}