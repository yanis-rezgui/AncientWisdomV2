import mongoose, { mongo } from "mongoose";
import Quote from "../models/quote.model.js";



export const getQuotes = async(req, res, next) => {
    try{

        const {
            search,
            era,
            author,
            page = 1,
            limit = 10
            } = req.query;

        const filters = {};

        if (search && search.trim() !== "") {
            const searchRegex = {
                $regex: search.trim(),
                $options: "i"
            };

            filters.$or = [
                { text: searchRegex },
                { source: searchRegex },
                { tags: searchRegex }
            ];
        }

        if(mongoose.isValidObjectId(era)){
            filters.era = era;
        }

        if(mongoose.isValidObjectId(author)){
            filters.author = author;
        }

            // =========================
            // Pagination
            // =========================
            const pageNumber = Math.max(Number(page) || 1, 1);
            const limitNumber = Math.max(Number(limit) || 10, 1);

            const skip = (pageNumber - 1) * limitNumber;


            const [quotes, total] = await Promise.all([
            Quote.find(filters)
                .populate("era").populate("author")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber),

            Quote.countDocuments()
            ]);

            return res.status(200).json({
                success : true,
                message : "Quotes fetched successfully",
                data : quotes,
                pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages: Math.ceil(
                    total / limitNumber
                ),
            },
            })


    }catch(err){
        next(err);
    }
}


export const getQuote = async(req, res, next) => {

    try{

        const quoteId = req.params.id;

        const quote = await Quote.findById(quoteId).populate("era").populate("author");

        if(!quote){
            return res.status(404).json({
                success : false,
                success : "Error quote not found"
            });
        }

        return res.status(200).json({
            success : true,
            message : "Quote fetched successfully",
            data : quote
        });

    }catch(err){
        next(err);
    }
}