import mongoose from "mongoose";



const testimonialSchema = new mongoose.Schema({
    
    fullName : {
        type : String,
        required : [true, "full name is required"],
        trim : true
    },
    message: {
        type: String,
        required : [true, "testimonial message is required"],
        trim : true
    },
    rating : {
        type : Number,
        required : [true, "rating is required"],
        max : 5,
        min : 1
    },
    active : {
        type : Boolean,
        default : true
    }
}, {timestamps : true});


const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;