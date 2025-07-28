const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 10000, // 10 seconds timeout
  socketTimeoutMS: 45000, // 45 seconds timeout
});

let db;

async function connectToMongoDB() {
  try {
    await client.connect();
    db = client.db(); // Gets the database from the connection string
    console.log("Connected to MongoDB Atlas!");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

// Basic route
app.get('/', (req, res) => {
  res.send('Talent Risk Dashboard API');
});

// Start server after DB connection
connectToMongoDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit();
});