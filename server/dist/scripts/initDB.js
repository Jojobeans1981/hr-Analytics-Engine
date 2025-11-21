"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabase = initDatabase;
exports.getDatabase = getDatabase;
const mongodb_1 = require("mongodb");
let db;
async function initDatabase() {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/talent-risk-ai';
        const client = new mongodb_1.MongoClient(uri);
        await client.connect();
        db = client.db();
        console.log('Database connected successfully');
        // Create indexes
        await db.collection('teams').createIndex({ name: 1 }, { unique: true });
        await db.collection('users').createIndex({ email: 1 }, { unique: true });
    }
    catch (error) {
        console.error('Database initialization failed:', error);
        throw error;
    }
}
function getDatabase() {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
}
