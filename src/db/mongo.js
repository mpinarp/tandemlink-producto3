import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

export const client = new MongoClient(process.env.MONGODB_URI);

export const connectDB = async () => {
    try {
        await client.connect();
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
};

export const db = client.db();
