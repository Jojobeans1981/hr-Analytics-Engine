import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import WebSocket from 'ws';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`❌ Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());





// Load environment variables
dotenv.config();


// Create HTTP server from Express app
console.log('🔍 Environment variables check:');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('All env vars:', Object.keys(process.env));

const server = http.createServer(app);

const MONGODB_URI = 'mongodb+srv://beamers051681:Wookie2011@Prometheus.inv2hx4.mongodb.net/Prometheus?retryWrites=true&w=majority';
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB connection error:', err));


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
      'https://dashboard-new-eta-blond.vercel.app', // Your actual Vercel frontend
      'https://your-frontend-app.vercel.app', // Remove or replace this
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
      console.log('Blocked by CORS:', origin); // Add logging
      callback(null, true); // Temporarily allow all for debugging
      // callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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

// MongoDB connection (if you're using MongoDB)
const connectDB = async (): Promise<void> => {
  try {
    if (process.env.MONGODB_URI) {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } else {
      console.log('No MongoDB URI provided, running without database');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

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

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Talent Risk Assessment API Server',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    endpoints: {
      health: '/api/health',
      data: '/api/data',
      websocket: `ws://localhost:${port}`
    }
  });
});

// WebSocket connection handler
wss.on('connection', (ws, request) => {
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
      }), ws as any); // Exclude the sender
      
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
function broadcastToAll(message: string, excludeWs?: WebSocket) {
  wss.clients.forEach((client) => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Endpoint to get WebSocket clients info
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
      'GET /api/websocket/clients'
    ]
  });
});

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to database if MongoDB URI is provided
    if (process.env.MONGODB_URI) {
      await connectDB();
    }
    
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