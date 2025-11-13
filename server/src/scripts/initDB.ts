import { MongoClient, Db } from 'mongodb';

let db: Db;

export async function initDatabase(): Promise<void> {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/talent-risk-ai';
    const client = new MongoClient(uri);
    
    await client.connect();
    db = client.db();
    
    console.log('Database connected successfully');
    
    // Create indexes
    await db.collection('teams').createIndex({ name: 1 }, { unique: true });
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

export function getDatabase(): Db {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}
