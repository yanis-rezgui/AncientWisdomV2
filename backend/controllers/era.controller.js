import mongoose from "mongoose";
import HistoricalEra from "../models/historicalEra.model.js";




export const getEras = async(req , res , next) => {

    try{

        const {
            search,
            page = 1,
            limit = 10
        } = req.query;

        const filters = {};

        if(search && search.trim() !== ""){
            const searchRegex = {
                $regex : search.trim(),
                $options : "i"
            }

            filters.$or = [
                {name : searchRegex},
                {description : searchRegex}
            ]

        }

        const pageNumber = Math.max(Number(page) || 1, 1);
        const limitNumber = Math.max(Number(limit) || 10, 1);

        const skip = (pageNumber - 1) * limitNumber;

        const [eras, total] = await Promise.all([
            HistoricalEra.find(filters).
            skip(skip).
            limit(limitNumber).
            sort({createdAt : -1}),
            HistoricalEra.countDocuments(filters)
        ]);


        return res.status(200).json({
            success : true,
            message : "Eras fetched successfully",
            data : eras,
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



export const getEra = async(req, res, next) => {

    try{

        const eraId = req.params.id;

        if(!mongoose.isValidObjectId(eraId)){
            return res.status(400).json({
                success : false,
                message : "Error eraId invalid"
            });
        }

        const era = await HistoricalEra.findById(eraId);

        if(!era){
            return res.status(404).json({
                success : false,
                message : "Error era not found"
            });
        }

        return res.status(200).json({
            success : true,
            message : "Era fetched successfully",
            data : era
        });

    }catch(err){
        next(err);
    }
}