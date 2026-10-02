import { DB_URI, NODE_ENV } from "../config/env.js";
import mongoose from "mongoose";

if (!DB_URI) {
    throw new Error(
        "Please define a mongodb URI Environment variable inside .env.<development/production>.local"
    );
}

const connectToDatabase = async () => {
    try {
        console.log("Trying connecting to database");
        console.log("NODE_ENV:", NODE_ENV);
        console.log("DB_URI exists:", Boolean(DB_URI));
        console.log("DB_URI host:", DB_URI.match(/@([^/?]+)/)?.[1]);

        await mongoose.connect(DB_URI);

        console.log(`Connected to Database in ${NODE_ENV} mode`);
    } catch (err) {
        console.error("Error connecting to database");
        console.error(err);
        process.exit(1);
    }
};

export default connectToDatabase;