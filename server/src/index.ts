import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const server = createServer(app); // Create HTTP server from Express app

// WebSocket Server - integrated with Express
const wss = new WebSocketServer({ 
  server, // Use the same server as Express
  perMessageDeflate: false
});

console.log('Ì∫Ä Starting integrated Express + WebSocket server...');

// WebSocket connection handler
wss.on('connection', (ws, request) => {
  const clientIP = request.socket.remoteAddress;
  console.log('Ì¥å New WebSocket client connected');
  console.log('Ì≥ç Client IP:', clientIP);
  console.log('Ì≥ç Total connections:', wss.clients.size);

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connected',
    message: 'WebSocket connection established',
    timestamp: new Date().toISOString(),
    totalConnections: wss.clients.size
  }));

  ws.on('message', (data) => {
    try {
      const message = data.toString();
      console.log('Ì≥® Received WebSocket message:', message);
      
      // Try to parse as JSON
      let parsedMessage;
      try {
        parsedMessage = JSON.parse(message);
      } catch {
        parsedMessage = { type: 'text', content: message };
      }

      // Handle different message types
      switch (parsedMessage.type) {
        case 'ping':
          ws.send(JSON.stringify({ 
            type: 'pong', 
            timestamp: new Date().toISOString() 
          }));
          break;
        case 'get_employees':
          ws.send(JSON.stringify({
            type: 'employees_data',
            data: [
              { id: 1, name: 'John Doe', riskScore: 25, riskLevel: 'Low' },
              { id: 2, name: 'Jane Smith', riskScore: 65, riskLevel: 'Medium' }
            ],
            timestamp: new Date().toISOString()
          }));
          break;
        default:
          // Echo back
          ws.send(JSON.stringify({
            type: 'echo',
            message: `Server received: ${message}`,
            timestamp: new Date().toISOString()
          }));
      }

    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message',
        timestamp: new Date().toISOString()
      }));
    }
  });

  ws.on('close', (code, reason) => {
    console.log('Ì¥å WebSocket client disconnected');
    console.log('Ì≥ç Close code:', code, 'Reason:', reason?.toString());
    console.log('Ì≥ç Total connections:', wss.clients.size);
  });

  ws.on('error', (error) => {
    console.error('‚ùå WebSocket error:', error);
  });
});

// Express Middleware
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['*']
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    websocket: {
      active: true,
      connections: wss.clients.size
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Prometheus Talent Engine API',
    version: '1.0.0',
    status: 'running',
    websocket: 'available'
  });
});

// API routes
app.get('/api/employees', (req, res) => {
  res.json([
    { 
      id: 1, 
      name: 'John Doe', 
      position: 'Developer',
      riskLevel: 'Low',
      department: 'Engineering'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      position: 'Designer',
      riskLevel: 'Medium', 
      department: 'Design'
    }
  ]);
});

app.get('/api/dashboard-metrics', (req, res) => {
  res.json({
    totalEmployees: 2,
    activeProjects: 5,
    riskScore: 3.2,
    riskLevel: {
      Low: 1,
      Medium: 1,
      High: 0,
      Critical: 0
    },
    departments: {
      Engineering: 1,
      Design: 1
    }
  });
});

// Handle preflight requests
app.options('*', cors());

// Start the integrated server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Ì∫Ä Server running on port ${PORT}`);
  console.log(`Ì≥ç Health: http://localhost:${PORT}/health`);
  console.log(`Ì≥ç API: http://localhost:${PORT}/api/employees`);
  console.log(`ÔøΩÔøΩ WebSocket: ws://localhost:${PORT}/`);
  console.log(`Ìºê Express + WebSocket integrated successfully`);
});
