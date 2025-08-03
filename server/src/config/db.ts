import mongoose from 'mongoose';
import logger from '../config/logger';

// Type for MongoDB connection config
interface MongoDBConfig {
  uri: string;
  maxPoolSize?: number;
  connectTimeoutMS?: number;
  socketTimeoutMS?: number;
}

// Default configuration
const DEFAULT_CONFIG: MongoDBConfig = {
  uri: process.env.MONGODB_URI!,
  maxPoolSize: 10, // Default connection pool size
  connectTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000 // 45 seconds
};

// Cache the connection to prevent hot-reload issues
let cachedConnection: typeof mongoose | null = null;

export async function connectDB(config: Partial<MongoDBConfig> = {}): Promise<typeof mongoose> {
  // Use cached connection if available
  if (cachedConnection) {
    logger.info('Using existing MongoDB connection');
    return cachedConnection;
  }

  // Merge config with defaults
  const finalConfig: MongoDBConfig = { ...DEFAULT_CONFIG, ...config };

  try {
    // Configure connection options
    const options = {
      maxPoolSize: finalConfig.maxPoolSize,
      connectTimeoutMS: finalConfig.connectTimeoutMS,
      socketTimeoutMS: finalConfig.socketTimeoutMS,
      serverSelectionTimeoutMS: 5000 // Timeout for server selection
    };

    logger.info('Connecting to MongoDB...');
    cachedConnection = await mongoose.connect(finalConfig.uri, options);

    // Event listeners
    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connection established');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB connection disconnected');
    });

    // Close connection on process termination
    process.on('SIGINT', async () => {
      await disconnectDB();
      process.exit(0);
    });

    return cachedConnection;
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    process.exit(1);
  }
}

export async function disconnectDB(): Promise<void> {
  if (!cachedConnection) {
    logger.warn('No active MongoDB connection to disconnect');
    return;
  }

  try {
    await mongoose.disconnect();
    cachedConnection = null;
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error('Error disconnecting MongoDB:', error);
  }
}

// Utility function to check connection status
export function getDBStatus(): string {
  return mongoose.connection.readyState.toString();
}