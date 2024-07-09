import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI,)
        console.log(`MongoDB connected successfully: ${conn.connection.host}`);
    } catch (err) {
        console.log(`MongoDB connection error: ${err.message}`);
        process.exit(1);          // process exit with status code 1, that means there was an error connecting to MongoDB
    }
};