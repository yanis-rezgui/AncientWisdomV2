import { config } from "dotenv";
import pkg from "cloudinary";
const { v2: cloudinary } = pkg;

if(process.env.NODE_ENV !== "production"){
    config({path: `.env.${process.env.NODE_ENV || "development"}.local`});
}


export const {
    NODE_ENV,
    PORT,
    DB_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    CLOUDINARY_AP,
    CLOUDINARY_API_KEY,
CLOUDINARY_API_SECRET,
CLOUDINARY_CLOUD_NAME,
} = process.env; 

cloudinary.config({ 
    cloud_name : CLOUDINARY_CLOUD_NAME,
    api_key : CLOUDINARY_API_KEY,
    api_secret : CLOUDINARY_API_SECRET
});


export {cloudinary};

