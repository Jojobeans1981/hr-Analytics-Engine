"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
exports.disconnectDB = disconnectDB;
exports.getDBStatus = getDBStatus;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_js_1 = __importDefault(require("../config/logger.js"));
// Default configuration
const DEFAULT_CONFIG = {
    uri: process.env.MONGODB_URI,
    maxPoolSize: 10, // Default connection pool size
    connectTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 45000 // 45 seconds
};
// Cache the connection to prevent hot-reload issues
let cachedConnection = null;
async function connectDB(config = {}) {
    // Use cached connection if available
    if (cachedConnection) {
        logger_js_1.default.info('Using existing MongoDB connection');
        return cachedConnection;
    }
    // Merge config with defaults
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    try {
        // Configure connection options
        const options = {
            maxPoolSize: finalConfig.maxPoolSize,
            connectTimeoutMS: finalConfig.connectTimeoutMS,
            socketTimeoutMS: finalConfig.socketTimeoutMS,
            serverSelectionTimeoutMS: 5000 // Timeout for server selection
        };
        logger_js_1.default.info('Connecting to MongoDB...');
        cachedConnection = await mongoose_1.default.connect(finalConfig.uri, options);
        // Event listeners
        mongoose_1.default.connection.on('connected', () => {
            logger_js_1.default.info('MongoDB connection established');
        });
        mongoose_1.default.connection.on('error', (err) => {
            logger_js_1.default.error(`MongoDB connection error: ${err.message}`);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            logger_js_1.default.warn('MongoDB connection disconnected');
        });
        // Close connection on process termination
        process.on('SIGINT', async () => {
            await disconnectDB();
            process.exit(0);
        });
        return cachedConnection;
    }
    catch (error) {
        logger_js_1.default.error('MongoDB connection failed:', error);
        process.exit(1);
    }
}
async function disconnectDB() {
    if (!cachedConnection) {
        logger_js_1.default.warn('No active MongoDB connection to disconnect');
        return;
    }
    try {
        await mongoose_1.default.disconnect();
        cachedConnection = null;
        logger_js_1.default.info('MongoDB connection closed');
    }
    catch (error) {
        logger_js_1.default.error('Error disconnecting MongoDB:', error);
    }
}
// Utility function to check connection status
function getDBStatus() {
    return mongoose_1.default.connection.readyState.toString();
}
