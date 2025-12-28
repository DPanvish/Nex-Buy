import mongoose from "mongoose";
import { ENV } from "../config/env.js";

const MONGODB_URI = ENV.MONGODB_URI;

const connectDB = async () => {
    if (!MONGODB_URI) {
        console.error("❌ MONGO_URI is not defined in the environment variables");
        process.exit(1);
    }

    try{
        const conn = await mongoose.connect(MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;