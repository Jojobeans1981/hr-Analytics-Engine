import { MongoClient, Db } from 'mongodb';

const uri = process.env., MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'talent-risk-ai';

let client: MongoClient;
let cachedDb: Db;

export async function getDb(): Promise<Db> {
  if (cachedDb) return cachedDb;

  client = await MongoClient.connect(uri);
  cachedDb = client.db(dbName);
  return cachedDb;
}

export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
  }
}