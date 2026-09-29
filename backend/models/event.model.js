import mongoose, { trusted } from "mongoose";


const eventSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    startDate : {
        type : String,
        required : true,

    },
    endDate : {
        type  : String,
        required : true
    },
    location : {
        type : String,
        required: true
    },
    era : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "HistoricalEra",
        required : true
    },
    description : String,
    sections : [
        {
            title : String,
            content : String
        }
    ],
    tags : [String]
}, {timestamps : true});

const Event = mongoose.model("Event", eventSchema);

export default Event;