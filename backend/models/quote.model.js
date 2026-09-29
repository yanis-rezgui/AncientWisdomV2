import mongoose from "mongoose";



const quoteSchema = new mongoose.Schema({
    text : {
        type : String,
        required : true
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Figure",
        required : true
    },
    era: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "HistoricalEra",
        required : true
    },
    source : {
        type : String,
        required : [true, "Source is required"]
    },
    tags : [String]
}, {timestamps : true});

const Quote = mongoose.model("Quote", quoteSchema);

export default Quote;