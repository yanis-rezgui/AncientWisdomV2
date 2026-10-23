import Testimonial from "../models/testimonial.model.js"




export const getActiveTestimonials = async(req , res , next) => {

    try{
        
        const activeTestimonials = await Testimonial.find({
            active : true
        });

        return res.status(200).json({
            success : true,
            message: "Testimonials got successfully",
            data : activeTestimonials
        });
    }catch(err){
        next(err);
    }
}

export const getTestimonials = async(req , res , next) => {

    try{

        const testimonials = await Testimonial.find();

        return res.status(200).json({
            success: true,
            message : "Testimonials fetched successfully",
            data : testimonials
        });
    }catch(err){
        next(err);
    }
}


export const updateTestimonial = async(req , res , next) => {

    try{

        const {fullName, message, rating, active} = req.body;

        const id = req.params.id;

        const updates = {};

        if(fullName !== undefined){
            if(!fullName || fullName.trim() === ""){
                return res.status(400).json({
                    success : false,
                    message :"Error fullName is required"
                });
            }

            updates.fullName = fullName.trim();
        }

        if(message !== undefined){
            if(!message || message.trim() === ""){
                return res.status(400).json({
                    success : false,
                    message: "Error, message is required",
                });
            }

            updates.message = message;
        }

         if(active !== undefined){
             if (typeof active !== "boolean") {
                   return res.status(400).json({
                    success : false,
                    message : "Error invalid status"
                   });
                }

            updates.active = active;
        }

        if(rating !== undefined){
            if(!Number(rating) || Number(rating) < 1 || Number(rating) > 5 ){
                return res.status(400).json({
                    success : false,
                    message : "rating must be a number between 1 and 5"
                });
            }

            updates.rating = Number(rating);
        }


        const testimonial = await Testimonial.findByIdAndUpdate(id,
             updates,
            {
                new : true,
                runValidators : true
            }
            );

        if(!testimonial){
            return res.status(404).json({
                success: false,
                message: "Error testimonial not found"
            });
        }

        return res.status(200).json({
            success : true,
            message : "Testimonial fetched successfully",
            data : testimonial
        });

    }catch(err){
        next(err);
    }
}



export const addTestimonial = async(req, res, next) => {

    try{

        const {fullName, message, active, rating} = req.body;

        if(!fullName || fullName.trim() === ""){
            return res.status(400).json({
                success : false,
                message : "Error fullName is required",
            });
        }

        if(!message || message.trim() === ""){
            return res.status(400).json({
                success : false,
                message: "Error message is required"
            });
        }

        const numericRating = Number(rating);

        if(Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5){
            return res.status(400).json({
                success : false,
                message: "Error rating must be a valid number between 1 and 5"
            });
        }

        const data = {
            fullName,
            message,
            rating : numericRating
        }

        if(typeof active === "boolean"){
            data.active = active
        }

        const newTestimonial = await Testimonial.create(data);

        return res.status(200).json({
            success : true,
            message : "Testimonial added successfully",
            data : newTestimonial
        });
    }catch(err){
        next(err);
    }
}


export const deleteTestimonial = async(req , res , next) => {

    try{

        const id = req.params.id;

        const testimonial = await Testimonial.findByIdAndDelete(id);

        if(!testimonial){
            return res.status(404).json({
                success : false,
                message : "Error testimonial not found"
            });
        }

        return res.status(200).json({
            success : true,
            message : "Message deleted successfully",
            data : testimonial
        });
    }catch(err){
        next(err);
    }
}