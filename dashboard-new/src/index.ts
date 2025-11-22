import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const server = createServer(app);

// WebSocket Server
const wss = new WebSocketServer({ 
  server,
  perMessageDeflate: false
});

wss.on('connection', (ws, request) => {
  const clientIP = request.socket.remoteAddress;
  console.log('í´Œ New WebSocket client connected');

  ws.send(JSON.stringify({
    type: 'connected',
    message: 'WebSocket connection established',
    timestamp: new Date().toISOString()
  }));

  ws.on('message', (data) => {
    try {
      const message = data.toString();
      console.log('í³¨ Received WebSocket message:', message);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('í´Œ WebSocket client disconnected');
  });

  ws.on('error', (error) => {
    console.error('âŒ WebSocket error:', error);
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

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString()
  });
});

// API routes - FIXED to match frontend expectations
app.get('/api/employees', (req, res) => {
  const employees = [
    { 
      id: 1, 
      name: 'John Doe', 
      position: 'Developer',
      riskLevel: 'Low',
      department: 'Engineering',
      riskScore: 25,
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      position: 'Designer',
      riskLevel: 'Medium', 
      department: 'Design',
      riskScore: 65,
      status: 'active'
    }
  ];
  
  res.json(employees);
});

app.get('/api/dashboard-metrics', (req, res) => {
  const metrics = {
    totalEmployees: 2,
    activeProjects: 5,
    riskScore: 3.2,
    riskLevel: {
      Low: 1,
      Medium: 1,
      High: 0,
      Critical: 0
    },
    // FIXED: Return departments as ARRAY, not object
    departments: ['Engineering', 'Design'],
    // Keep other arrays empty to prevent errors
    alerts: [],
    notifications: [],
    recentActivities: [],
    data: [],
    items: []
  };
  
  res.json(metrics);
});

// Handle preflight requests
app.options('*', cors());

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`íº€ Server running on port ${PORT}`);
});
