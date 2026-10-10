import mongoose from "mongoose";



const movieSchema = new mongoose.Schema({
    title : {
        type : String,
        minLength : 1,
        maxLength : 150,
        trim : true,
        required : [true, "Title is required"]
    },
    description : {
        type : String,
        minLength : 1,
        maxLength : 4000,
        required : [true, "Description is required"],
        trim : true
    },
    era : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "HistoricalEra",
        default : null
    },
     image: {
            url: {
                type: String,
                required: [true, "Image URL is required"],
            },
            publicId: {
                type: String,
                required: [true, "Image public ID is required"],
            },
        }
},{timestamps : true});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;