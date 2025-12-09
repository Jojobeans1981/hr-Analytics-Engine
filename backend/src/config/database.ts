import mongoose from 'mongoose';
import logger from './logger';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/talent-analytics');
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`MongoDB connection error: ${error}`);
    process.exit(1);
  }
};

export { connectDB };
