import mongoose, { mongo } from "mongoose";



const bookSchema = new mongoose.Schema({
    title : {
        type : String,
        required : [true, "Title is required"],
        trim : true,
        minLength : 1,
        maxLength : 150
    },
    author : {
       type :String,
       required : [true, "Author is required"],
       trim : true,
       minLength : 1,
       maxLength : 150
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
    description : {
        type : String,
        required : [true, "Description is required"],
        trim : true,
        minLength : 1,
        maxLength : 4000
    },
    era : {
        type :mongoose.Schema.Types.ObjectId,
        ref : "HistoricalEra",
        required : [true, "Historical Era"]
    },

});


const Book = mongoose.model("Book", bookSchema);

export default Book;