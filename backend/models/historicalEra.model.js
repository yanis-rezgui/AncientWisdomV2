import mongoose from "mongoose";



const historicalEraSchema = new mongoose.Schema({
    name : {
        type : String,
        required: [true, "name is required"],
        minLength : 1,
        maxLength : 150
    },
    startYear : {
        type : Number,
        required : [true, "Start year is required"],
    },
    endYear : {
        type : Number,
        required : [true, "End year is required"]
    },
    description : {
        type : String,
        required : [true, "description is required"],
        minLength : 5,
        
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
    }
}, {timestamps : true});

const HistoricalEra = mongoose.model("HistoricalEra", historicalEraSchema);

export default HistoricalEra;