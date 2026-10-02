import mongoose, { mongo } from "mongoose";



const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : [true, "first name is required"],
        minLength : 1,
        maxLength : 100,
        trim : true
    },
    lastName : {
        type : String,
        required : [true, "Last name is required"],
        trim : true,
        minLength : 1,
        maxLength : 100,
    },
    email : {
        type : String,
        required : [true, "Email is required"],
        unique : true,
       match: [
            /^\S+@\S+\.\S+$/,
            "Please provide a valid email address"
        ],
       minLength : 5,
       maxLength : 255
    },
    password : {
        type : String,
        required : [true, "Password is required"],
      
    },
    role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER"
    },

}, {timestamps : true});


const User = mongoose.model("User", userSchema);

export default User;