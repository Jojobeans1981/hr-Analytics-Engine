import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const server = createServer(app);

const wss = new WebSocketServer({ 
  server,
  perMessageDeflate: false
});

wss.on('connection', (ws, request) => {
  console.log('í´Œ New WebSocket client connected');
  ws.send(JSON.stringify({
    type: 'connected',
    message: 'WebSocket connection established',
    timestamp: new Date().toISOString()
  }));
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

// API routes - CRITICAL FIX: departments as ARRAY
app.get('/api/employees', (req, res) => {
  const employees = [
    { 
      id: 1, 
      name: 'John Doe', 
      position: 'Developer',
      riskLevel: 'Low',
      department: 'Engineering',
      riskScore: 25
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      position: 'Designer',
      riskLevel: 'Medium', 
      department: 'Design',
      riskScore: 65
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
    // âš ï¸ CRITICAL FIX: This MUST be an ARRAY, not object
    departments: ['Engineering', 'Design'], // ARRAY for .map() to work
    alerts: [],
    notifications: []
  };
  res.json(metrics);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`íº€ Server running on port ${PORT}`);
});
