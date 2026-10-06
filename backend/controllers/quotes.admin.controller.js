import mongoose from "mongoose";
import Figure from "../models/historicalFigure.model.js";
import HistoricalEra from "../models/historicalEra.model.js";
import Quote from "../models/quote.model.js";




export const addQuote = async(req, res, next) => {

    try{

        const {text, author, source, era, tags} = req.body;

        if(!text || text.trim() === ""){
            return res.status(400).json({
                success : false,
                message : "Quote text is required"
            });
        }

        if(!mongoose.isValidObjectId(author)){
            return res.status(400).json({
                success : false,
                message : "Error invalid author Id"
            });
        }

        const existingAuthor = await Figure.findById(author);

        if(!existingAuthor){
            return res.status(400).json({
                success : false,
                message : "Error author not found"
            });
        }

        if(!source || source.trim() === ""){
            return res.status(400).json({
                success : false,
                message : "Error source is required"
            });
        }

        if(!mongoose.isValidObjectId(era)){
            return res.status(400).json({
                success : false,
                message : "Error invalid era id"
            });
        }

        const existingEra = await HistoricalEra.findById(era);

        if(!existingEra){
             return res.status(400).json({
                success: false,
                message : "Error era not found"
             });
        }

        let normalizedTags

        if (tags !== undefined) {

            let parsedTags = [];

            try {
                parsedTags =
                    typeof tags === "string"
                        ? JSON.parse(tags)
                        : tags;

                if (!Array.isArray(parsedTags)) {
                    return res.status(400).json({
                        success: false,
                        message: "Les caractéristiques sont invalides"
                    });
                }

            } catch {
                return res.status(400).json({
                    success: false,
                    message: "Format des caractéristiques invalide"
                });
            }

            if (
                !parsedTags.every(
                    (tag) => typeof tag === "string"
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Tags must be an array"
                });
            }

            normalizedTags = parsedTags
                .map((feature) => feature.trim())
                .filter(Boolean);
        } else {
            normalizedTags = [];
        }

        const newQuote = await Quote.create({
            text : text.trim(),
            author : author.trim(),
            era: era.trim(),
            source : source.trim(),
            tags : normalizedTags
        });


        return res.status(201).json({
            success : true,
            message: "Quote created successfully",
            data: newQuote
        });
    }catch(err){
        next(err);
    }
}



export const updateQuote = async(req, res, next) => {

    try{

        const quoteId = req.params.id;

        if(!mongoose.isValidObjectId(quoteId)){
            return res.status(400).json({
                success : false,
                message: "Error invalid quote id"
            });
        }

        const existingQuote = await Quote.findById(quoteId);

        if(!existingQuote){
            return res.status(404).json({
                success : false,
                message : "Error quote not found"
            });
        }


        const {text, author, source, era, tags} = req.body;

        const updates = {};

        if(text !== undefined){
            if(text.trim() === ""){
            return res.status(400).json({
                success : false,
                message : "Quote text is required"
            });
           }

          updates.text = text.trim();
         
        }

        if(author !== undefined){

                if(!mongoose.isValidObjectId(author)){
                return res.status(400).json({
                    success : false,
                    message : "Error invalid author Id"
                });
            }

            const existingAuthor = await Figure.findById(author);

            if(!existingAuthor){
                return res.status(400).json({
                    success : false,
                    message : "Error author not found"
                });
            }

            updates.author = author.trim()
        }

        if(source !== undefined){

            if(source.trim() === ""){
            return res.status(400).json({
                success : false,
                message : "Error source is required"
            });
            } 

            updates.source = source.trim()
        }


        if(era !== undefined){

                if(!mongoose.isValidObjectId(era)){
                    return res.status(400).json({
                        success : false,
                        message : "Error invalid era id"
                    });
                }

                const existingEra = await HistoricalEra.findById(era);

                if(!existingEra){
                    return res.status(400).json({
                        success: false,
                        message : "Error era not found"
                    });
                }

                updates.era = era

        }


if (tags !== undefined) {
    let parsedTags = [];

    try {
        parsedTags =
            typeof tags === "string"
                ? JSON.parse(tags)
                : tags;
    } catch {
        return res.status(400).json({
            success: false,
            message: "Invalid tags format"
        });
    }

    if (!Array.isArray(parsedTags)) {
        return res.status(400).json({
            success: false,
            message: "Tags must be an array"
        });
    }

    if (!parsedTags.every(tag => typeof tag === "string")) {
        return res.status(400).json({
            success: false,
            message: "Each tag must be a string"
        });
    }

    updates.tags = [
        ...new Set(
            parsedTags
                .map(tag => tag.trim())
                .filter(Boolean)
        )
    ];
}

    
        const updatedQuote = await Quote.findByIdAndUpdate(
            quoteId,
             updates,
            {
                new : true,
                runValidators : true
            }
            );

         return res.status(200).json({
            success : true,
            message:  "Quote updated successfully",
            data : updatedQuote
         });

    }catch(err){
        next(err);
    }
}

export const deleteQuote = async (req, res, next) => {
    try {
        const quoteId = req.params.id;

        if (!mongoose.isValidObjectId(quoteId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid quote ID"
            });
        }

        const deletedQuote = await Quote.findByIdAndDelete(quoteId);

        if (!deletedQuote) {
            return res.status(404).json({
                success: false,
                message: "Quote not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Quote deleted successfully"
        });

    } catch (err) {
        next(err);
    }
};