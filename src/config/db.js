require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 50, // Recommended for production
  wtimeoutMS: 2500
});

let isConnected = false;

module.exports = {
  connect: async () => {
    if (isConnected) return client.db();
    
    try {
      await client.connect();
      await client.db().command({ ping: 1 });
      isConnected = true;
      console.log('✅ MongoDB connected successfully');
      return client.db();
    } catch (err) {
      console.error('❌ MongoDB connection failed:', err);
      process.exit(1);
    }
  },
  
  close: async () => {
    if (isConnected) {
      await client.close();
      isConnected = false;
    }
  }
};