import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
    title : {
        type : String,
        required : [true, "title is required"],
        minLength : 1,
        maxLength : 150,
        trim : true
    },
    description : {
        type : String,
        required : [true, "description is required"],
        minLength : 1,
        maxLength : 3000,
        trim : true
    },
    image : {
        url: {
            type: String,
            required: true
        },
        publicId: {
            type: String,
            required: true
        }
    },
    sections : [
        {
            title : String,
            content : String
        }
    ],
    tags : [String],
    era : {
            type :mongoose.Schema.Types.ObjectId,
            ref : "HistoricalEra",
            required : [true, "Historical Era"]
        }
},{timestamps : true});

const Article = mongoose.model("Article", articleSchema);

export default Article;