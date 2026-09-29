import mongoose from "mongoose";



const figureSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Name is required"],
        minLength : 1,
        
    },
    birthDate : {
        type : String,
        required : [true, "Birth Date is required"],
        
    },
    birthPlace : {
        type : String,
        required : [true, "Birth place is required"],
        minLength : 1
    },
    deathDate : {
        type : String,
        required : [true, "Death Date is required"],
    },
    deathPlace : {
        type : String,
        required : [true, "death place is required"]
    },
    eras :{ 
        type : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "HistoricalEra",
        required : [true, "Historical Era is required"]
    }],
    required: [true, "At least one historical era is required"],
    validate: {
        validator: value => value.length > 0,
        message: "At least one historical era is required"
    }

},
    biography : [
        {
            title : {
                type : String,
                required : [true, "Title is required"],
                trim: true
            },
            content : {
                type : String,
                required : [true, "Content is required"],
                trim : true
            }
        }
    ],
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
    tags : [String]
}, {timestamps : true});


const Figure = mongoose.model("Figure", figureSchema);

export default Figure;