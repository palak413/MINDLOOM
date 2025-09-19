import mongoose from 'mongoose';
import logger from '../utils/logger.js'; // Assuming you have a logger file

const connectDB = async () => {
    try {
        // --- TEMPORARY TEST ---
        // Replace the line below with your full connection string.
        // MAKE SURE to put your real password in the string.
        const connectionInstance = await mongoose.connect("mongodb+srv://dbYash:Yash%402005@cluster0.sirjhzl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

        logger.info(`\n✅ MongoDB connected successfully! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        logger.error("❌ MONGODB connection FAILED: ", error);
        process.exit(1);
    }
};

export default connectDB;