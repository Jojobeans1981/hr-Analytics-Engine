"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = getDb;
exports.closeConnection = closeConnection;
const mongodb_1 = require("mongodb");
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'talent-risk-ai';
let client;
let cachedDb;
async function getDb() {
    if (cachedDb)
        return cachedDb;
    client = await mongodb_1.MongoClient.connect(uri);
    cachedDb = client.db(dbName);
    return cachedDb;
}
async function closeConnection() {
    if (client) {
        await client.close();
    }
}
