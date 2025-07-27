import mongoose from 'mongoose';
import logger from './logger.js';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        logger.info(`MongoDB connected: ${mongoose.connection.host}`);
    } catch (error) {
        logger.error(`MongoDB connection error: %s`, error.message);
        process.exit(1);
    }
}