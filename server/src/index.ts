import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import mongoose from 'mongoose';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// Only load dotenv in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();
const port = process.env.PORT || 3001;

// Fix trust proxy for rate limiting
app.set('trust proxy', 1);

// Create HTTP server from Express app
const server = http.createServer(app);

// Use require for WebSocket to avoid type issues
const WebSocket = require('ws');

// Create WebSocket server attached to the same server
const wss = new WebSocket.Server({ 
  server,
  perMessageDeflate: false
});

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      'https://dashboard-gfjo6f4rg-joseph-panettas-projects.vercel.app',
      'http://localhost:3000',
      'http://localhost:5173'
    ]
  : [
      'http://localhost:3000',
      'http://localhost:5173'
    ];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Hardcode MongoDB URI to fix connection issues
const MONGODB_URI = 'mongodb+srv://beamers051681:Wookie2011@Prometheus.inv2hx4.mongodb.net/Prometheus?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected successfully');
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error);
  }
};

// Call this function after your app setup
connectDB();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    nodeVersion: process.version,
    websocketConnections: wss.clients.size
  });
});

// Your existing API endpoint
app.get('/api/data', (req, res) => {
  res.json({ 
    message: 'Hello from the backend!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Dashboard metrics endpoint
app.get('/api/dashboard-metrics', async (req, res) => {
  try {
    // Get real data from MongoDB
    const totalEmployees = await mongoose.connection.db.collection('employees').countDocuments();
    
    // Calculate average risk score
    const avgRiskResult = await mongoose.connection.db.collection('employees').aggregate([
      { $group: { _id: null, avgRisk: { $avg: '$riskScore' } } }
    ]).toArray();
    const avgRisk = avgRiskResult[0]?.avgRisk || 0;

    // Get departments
    const departments = await mongoose.connection.db.collection('employees').distinct('department');
    
    // Get risk level counts
    const riskLevels = await mongoose.connection.db.collection('employees').aggregate([
      { $group: { _id: '$riskLevel', count: { $sum: 1 } } }
    ]).toArray();

    const riskLevelsObj = {
      Low: riskLevels.find(r => r._id === 'Low')?.count || 0,
      Medium: riskLevels.find(r => r._id === 'Medium')?.count || 0,
      High: riskLevels.find(r => r._id === 'High')?.count || 0
    };

    res.json({
      totalEmployees,
      avgRisk: Math.round(avgRisk * 10) / 10,
      departments,
      riskLevels: riskLevelsObj
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    // Return mock data if database fails
    res.json({
      totalEmployees: 150,
      avgRisk: 45.2,
      departments: ['Engineering', 'Sales', 'Marketing', 'HR'],
      riskLevels: { Low: 80, Medium: 50, High: 20 }
    });
  }
});

// Employees endpoint
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await mongoose.connection.db.collection('employees').find({}).toArray();
    res.json({ employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    // Return mock data if database fails
    res.json({
      employees: [
        { _id: '1', name: 'John Doe', email: 'john@company.com', department: 'Engineering', riskScore: 35, riskLevel: 'Low' },
        { _id: '2', name: 'Jane Smith', email: 'jane@company.com', department: 'Sales', riskScore: 65, riskLevel: 'Medium' },
        { _id: '3', name: 'Bob Johnson', email: 'bob@company.com', department: 'Marketing', riskScore: 78, riskLevel: 'High' }
      ]
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Talent Risk Assessment API Server',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    endpoints: {
      health: '/api/health',
      data: '/api/data',
      dashboard: '/api/dashboard-metrics',
      employees: '/api/employees',
      websocket: `ws://localhost:${port}`
    }
  });
});

// WebSocket connection handler
wss.on('connection', (ws: any, request) => {
  console.log('🔌 New WebSocket client connected');
  console.log(`📍 Total connections: ${wss.clients.size}`);
  
  // Get client IP (useful for logging)
  const clientIP = request.socket.remoteAddress;
  console.log(`📍 Client IP: ${clientIP}`);
  
  // Send welcome message when client connects
  ws.send(JSON.stringify({ 
    type: 'welcome',
    message: 'Connected to WebSocket server',
    timestamp: new Date().toISOString(),
    connectionId: Math.random().toString(36).substr(2, 9),
    totalConnections: wss.clients.size
  }));
  
  // Handle messages from client
  ws.on('message', (data) => {
    try {
      const message = data.toString();
      console.log('📨 Received message:', message);
      
      // Parse JSON if possible
      let parsedMessage;
      try {
        parsedMessage = JSON.parse(message);
      } catch {
        parsedMessage = { text: message };
      }
      
      // Echo back to client
      ws.send(JSON.stringify({
        type: 'echo',
        originalMessage: parsedMessage,
        timestamp: new Date().toISOString(),
        server: 'Talent Risk API'
      }));
      
      // Broadcast to all other clients (optional)
      broadcastToAll(JSON.stringify({
        type: 'broadcast',
        message: `User sent: ${typeof parsedMessage === 'object' ? JSON.stringify(parsedMessage) : parsedMessage}`,
        timestamp: new Date().toISOString(),
        connections: wss.clients.size
      }), ws); // Exclude the sender
      
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process your message',
        timestamp: new Date().toISOString()
      }));
    }
  });
  
  // Handle client disconnect
  ws.on('close', (code, reason) => {
    console.log('🔌 WebSocket client disconnected');
    console.log(`📍 Total connections: ${wss.clients.size}`);
    console.log(`📍 Close code: ${code}, Reason: ${reason}`);
  });
  
  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
  
  // Send periodic updates (optional)
  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'heartbeat',
        timestamp: new Date().toISOString(),
        connections: wss.clients.size,
        uptime: process.uptime()
      }));
    }
  }, 30000); // Every 30 seconds
  
  // Clean up interval on close
  ws.on('close', () => {
    clearInterval(interval);
  });
});

// Broadcast function to send to all clients except sender
function broadcastToAll(message: string, excludeWs?: any) {
  wss.clients.forEach((client: any) => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Get all connected clients (useful for admin)
app.get('/api/websocket/clients', (req, res) => {
  const clients = Array.from(wss.clients as any).map((client: any) => ({
    readyState: client.readyState === WebSocket.OPEN ? 'open' : 
                client.readyState === WebSocket.CONNECTING ? 'connecting' :
                client.readyState === WebSocket.CLOSING ? 'closing' : 'closed'
  }));
  
  res.json({
    totalConnections: wss.clients.size,
    openConnections: clients.filter((c: any) => c.readyState === 'open').length,
    clients: clients
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'GET /api/data',
      'GET /api/dashboard-metrics',
      'GET /api/employees',
      'GET /api/websocket/clients'
    ]
  });
});

// Start server
const startServer = async (): Promise<void> => {
  try {
    server.listen(port, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${port}`);
      console.log(`📍 HTTP API: http://localhost:${port}`);
      console.log(`🔌 WebSocket: ws://localhost:${port}`);
      console.log(`❤️  Health check: http://localhost:${port}/api/health`);
      console.log(`📊 WebSocket clients: http://localhost:${port}/api/websocket/clients`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

startServer();

export default app;