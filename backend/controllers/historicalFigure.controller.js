import mongoose from "mongoose";
import Figure from "../models/historicalFigure.model.js";



export const getHistoricalFigures = async(req, res, next) => {

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
                $options: "i"
            };

            filters.$or = [
                {name : searchRegex},
                {tags : searchRegex},
                {birthPlace : searchRegex},
                {deathPlace : searchRegex},
            ]
        }

        if(era && mongoose.isValidObjectId(era)){
            filters.eras = era;
        }

        const pageNumber = Math.max(Number(page) || 1, 1);
        const limitNumber = Math.max(Number(limit) || 10, 1);

        const skip = (pageNumber - 1) * limitNumber;

        const [figures, total] = await Promise.all([
            Figure.find(filters)
               .populate("eras")
               .sort({createdAt : -1})
               .skip(skip)
               .limit(limitNumber),

            Figure.countDocuments(filters)
        ]);

                    return res.status(200).json({
                success : true,
                message : "Figures fetched successfully",
                data : figures,
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


export const getHistoricalFigure = async(req, res, next) => {
    try{

        const figureId = req.params.id;

        if(!mongoose.isValidObjectId(figureId)){
            return res.status(400).json({
                success : false,
                message : "Error id not valid"
            });
        }

        const figure = await Figure.findById(figureId).populate("eras");

        if(!figure){
            return res.status(404).json({
                success : false,
                message : "Error figure not found"
            });
        }

        return res.status(200).json({
            success : true,
            message : "Figure fetched",
            data : figure
        });


    }catch(err){
        next(err);
    }
}