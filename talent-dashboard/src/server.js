require('dotenv').config();
const app = require('./App.tsx');
const logger = require('./config/logger');

const PORT = process.env.PORT || 3001;

// Start server without MongoDB for now
// app.listen(PORT, () => {
//   logger.info(`Server running on port ${PORT}`);
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
//   console.log(`⚠️  Running without MongoDB - database features disabled`);
// });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  loggerrequire('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

// Database Connection Setup
const connectDB = async () => {
  try {
  const client = await MongoClient.connect(process.env.MONGODB_URI, {
  serverApi: {
   
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
});
    console.log('MongoDB Connected...');
    return client.db(); // returns the database instance
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

// Initialize Server
const startServer = async () => {
  const db = await connectDB();
  
  // Middleware
  app.use(express.json());
  
  // Simple Test Route
  app.get('/', (req, res) => {
    res.send('Talent Analytics API Running');
  });
  
  // Actual API Routes would go here
  // app.use('/api/users', require('./routes/users'));
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

startServer().error('Unhandled Promise Rejection:', err);
  // Don't exit on database errors for now
});