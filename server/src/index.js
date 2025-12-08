const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import routes (adjust these based on your actual routes)
 const talentRoutes = require('./routes/employees.route');
 const riskRoutes = require('./routes/risk.routes');

// Initialize Express app
const app = express();

// ====================
// CORS Configuration
// ====================
const allowedOrigins = [
  'https://dashboard-new-eta-blond.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://prometheus-talent-engine-production.up.railway.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Cache-Control',
    'Accept',
    'Origin', 
    'X-Requested-With',
    'X-CSRF-Token'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  exposedHeaders: ['Content-Length', 'Content-Type', 'Authorization']
}));

// ====================
// Middleware
// ====================
app.use(helmet()); // Security headers
app.use(morgan('dev')); // HTTP request logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// ====================
// Health Check Route
// ====================
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Talent Risk AI Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ====================
// API Routes
// ====================
// Uncomment and adjust these based on your actual routes
// app.use('/api/talent', talentRoutes);
// app.use('/api/risk', riskRoutes);

// ====================
// Error Handling Middleware
// ====================
// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
    method: req.method
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  
  // Handle CORS errors specifically
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      status: 'error',
      message: 'CORS policy: Origin not allowed'
    });
  }
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ====================
// Server Startup
// ====================
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on http://${HOST}:${PORT}`);
    console.log(`📅 Started at: ${new Date().toLocaleString()}`);
    console.log(`🌍 Allowed Origins: ${allowedOrigins.join(', ')}`);
  });
}

module.exports = app; // For testing