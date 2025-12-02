import express from 'express';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import WebSocket, { Server as WebSocketServer } from 'ws';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import riskRoutes from './src/routes/risk.routes';
import employeesRoutes from './src/routes/employees.route';
import dashboardRoutes from './src/routes/dashboard.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// ---------- CORS (single, clean config) ----------
const allowedOrigins = [
  'https://dashboard-new-eta-blond.vercel.app', // Vercel frontend
  'http://localhost:3000',
  'http://localhost:5173',
];

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log('Blocked by CORS:', origin);
    // Do NOT throw; just deny CORS
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Apply CORS and preflight handling globally
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ---------- Environment / server setup ----------
console.log('🔍 Environment variables check:');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('All env vars:', Object.keys(process.env));

const server = http.createServer(app);

// ---------- WebSocket server ----------
const wss = new WebSocketServer({
  server,
  perMessageDeflate: false,
});

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Request logging (simple)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    origin: req.headers.origin,
    'user-agent': req.headers['user-agent'],
  });
  next();
});

// HTTP logging (morgan)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ---------- MongoDB connection ----------
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

// ---------- HTTP routes ----------

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    nodeVersion: process.version,
    websocketConnections: wss.clients.size,
  });
});

// Simple test endpoint
app.get('/api/data', (req, res) => {
  res.json({
    message: 'Hello from the backend!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
app.use('/api/risk/employees', employeesRoutes); // if you use nested route
app.use('/api/risk', riskRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Talent Risk Assessment API Server',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    endpoints: {
      health: '/api/health',
      data: '/api/data',
      risk: '/api/risk/*',
      employees: '/api/employees',
      dashboard: '/api/dashboard',
      websocket: `ws://localhost:${port}`,
    },
  });
});

// ---------- WebSocket handlers ----------
wss.on('connection', (ws: WebSocket, request: http.IncomingMessage) => {
  console.log('🔌 New WebSocket client connected');
  console.log(`📍 Total connections: ${wss.clients.size}`);

  const clientIP = request.socket.remoteAddress;
  console.log(`📍 Client IP: ${clientIP}`);

  ws.send(
    JSON.stringify({
      type: 'welcome',
      message: 'Connected to WebSocket server',
      timestamp: new Date().toISOString(),
      connectionId: Math.random().toString(36).substr(2, 9),
      totalConnections: wss.clients.size,
    })
  );

  ws.on('message', (data: Buffer) => {
    try {
      const message = data.toString();
      console.log('📨 Received message:', message);

      let parsedMessage: any;
      try {
        parsedMessage = JSON.parse(message);
      } catch {
        parsedMessage = { text: message };
      }

      ws.send(
        JSON.stringify({
          type: 'echo',
          originalMessage: parsedMessage,
          timestamp: new Date().toISOString(),
          server: 'Talent Risk API',
        })
      );

      // Broadcast to all other clients (optional)
      broadcastToAll(
        JSON.stringify({
          type: 'broadcast',
          message:
            'User sent: ' +
            (typeof parsedMessage === 'object'
              ? JSON.stringify(parsedMessage)
              : parsedMessage),
          timestamp: new Date().toISOString(),
          connections: wss.clients.size,
        }),
        ws as any // exclude sender
      );
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(
        JSON.stringify({
          type: 'error',
          message: 'Failed to process your message',
          timestamp: new Date().toISOString(),
        })
      );
    }
  });

  ws.on('close', (code, reason) => {
    console.log('🔌 WebSocket client disconnected');
    console.log(`📍 Total connections: ${wss.clients.size}`);
    console.log(`📍 Close code: ${code}, Reason: ${reason}`);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: 'heartbeat',
          timestamp: new Date().toISOString(),
          connections: wss.clients.size,
          uptime: process.uptime(),
        })
      );
    }
  }, 30000);

  ws.on('close', () => {
    clearInterval(interval);
  });
});

function broadcastToAll(message: string, excludeWs?: WebSocket) {
  wss.clients.forEach((client: WebSocket) => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Endpoint to get WebSocket clients info
app.get('/api/websocket/clients', (req, res) => {
  const clients = Array.from(wss.clients as any).map((client: any) => ({
    readyState:
      client.readyState === WebSocket.OPEN
        ? 'open'
        : client.readyState === WebSocket.CONNECTING
        ? 'connecting'
        : client.readyState === WebSocket.CLOSING
        ? 'closing'
        : 'closed',
  }));

  res.json({
    totalConnections: wss.clients.size,
    openConnections: clients.filter((c: any) => c.readyState === 'open')
      .length,
    clients,
  });
});

// ---------- 404 + error handling ----------

// 404 handler (must be after all routes)
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'GET /api/data',
      'GET /api/websocket/clients',
    ],
  });
});

// Error handling middleware (last)
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'production' ? {} : err.message,
    });
  }
);

// ---------- Server start / shutdown ----------

const startServer = async (): Promise<void> => {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
    }

    server.listen(port, () => {
      console.log(
        `🚀 Server running in ${process.env.NODE_ENV} mode on port ${port}`
      );
      console.log(`📍 HTTP API: http://localhost:${port}`);
      console.log(`🔌 WebSocket: ws://localhost:${port}`);
      console.log(`❤️  Health check: http://localhost:${port}/api/health`);
      console.log(
        `📊 WebSocket clients: http://localhost:${port}/api/websocket/clients`
      );
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

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