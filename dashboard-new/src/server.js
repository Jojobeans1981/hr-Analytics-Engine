require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

const cors = require('cors');
app.use(cors());

// Database Connection Setup
const connectDB = async () => {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      serverApi: {
        version: '1',
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

// Mock data for immediate testing
const mockDashboardMetrics = {
  totalEmployees: 47,
  activeProjects: 12,
  revenue: 125000,
  growth: 15.3
};

const mockEmployees = [
  { id: 1, name: "John Doe", position: "Developer", department: "Engineering" },
  { id: 2, name: "Jane Smith", position: "Designer", department: "Design" },
  { id: 3, name: "Mike Johnson", position: "Manager", department: "Operations" }
];

// Initialize Server
const startServer = async () => {
  let db;
  
  try {
    db = await connectDB();
    console.log('Database connected successfully');
  } catch (err) {
    console.log('Running without database - using mock data');
    // Continue without database connection
  }

  // Middleware
  app.use(express.json());
  
  // Simple Test Route
  app.get('/', (req, res) => {
    res.send('Welcome to Prometheus!!');
  });
  
  // API Routes - Add these to fix your 404 errors
  app.get('/api/dashboard-metrics', (req, res) => {
    res.json(mockDashboardMetrics);
  });

  app.get('/api/employees', (req, res) => {
    res.json(mockEmployees);
  });

  // Serve static files from React build (if you have a build folder)
  app.use(express.static('build'));

  // For any other requests, return React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Don't exit on database errors for now
});

startServer();