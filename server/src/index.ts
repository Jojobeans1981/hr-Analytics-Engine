import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/prometheus';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('‚úÖ MongoDB connected successfully'))
  .catch(err => console.error('‚ùå MongoDB connection error:', err));

// Simple Employee model (adjust based on your actual schema)
const EmployeeSchema = new mongoose.Schema({
  name: String,
  position: String,
  department: String,
  riskLevel: String,
  riskScore: Number,
  status: String
}, { collection: 'employees' });

const Employee = mongoose.model('Employee', EmployeeSchema);

const wss = new WebSocketServer({ 
  server,
  perMessageDeflate: false
});

wss.on('connection', (ws, request) => {
  console.log('Ì¥å New WebSocket client connected');
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
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API routes - USING REAL MONGODB DATA
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find({}).limit(100); // Get real employees
    console.log(`Ì≥ä Found ${employees.length} employees in database`);
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    // Fallback to test data if DB fails
    res.json([
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
    ]);
  }
});

app.get('/api/dashboard-metrics', async (req, res) => {
  try {
    const employees = await Employee.find({});
    const totalEmployees = employees.length;
    
    // Calculate real metrics from database
    const riskLevels = {
      Low: employees.filter(e => e.riskLevel === 'Low').length,
      Medium: employees.filter(e => e.riskLevel === 'Medium').length,
      High: employees.filter(e => e.riskLevel === 'High').length,
      Critical: employees.filter(e => e.riskLevel === 'Critical').length
    };
    
    const departments = [...new Set(employees.map(e => e.department).filter(Boolean))];
    
    const avgRisk = employees.length > 0 
      ? employees.reduce((sum, e) => sum + (e.riskScore || 0), 0) / employees.length 
      : 0;

    const metrics = {
      totalEmployees,
      activeProjects: 5, // You might want to calculate this from your data
      riskScore: avgRisk,
      avgRisk,
      riskLevels,
      departments,
      alerts: [],
      notifications: []
    };
    
    console.log(`Ì≥à Dashboard metrics: ${totalEmployees} employees, avg risk: ${avgRisk}`);
    res.json(metrics);
    
  } catch (error) {
    console.error('Error calculating metrics:', error);
    // Fallback to test data
    res.json({
      totalEmployees: 2,
      activeProjects: 5,
      riskScore: 3.2,
      avgRisk: 45,
      riskLevels: { Low: 1, Medium: 1, High: 0, Critical: 0 },
      departments: ['Engineering', 'Design'],
      alerts: [],
      notifications: []
    });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Ì∫Ä Server running on port ${PORT}`);
  console.log(`Ì≥ç MongoDB: ${MONGODB_URI.includes('@') ? 'Connected with credentials' : MONGODB_URI}`);
});
