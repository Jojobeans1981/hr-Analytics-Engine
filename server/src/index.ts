import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

// CORS configuration - ALLOW EVERYTHING
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
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Prometheus Talent Engine API',
    version: '1.0.0',
    status: 'running'
  });
});

// API routes - Updated to match frontend expectations
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Ì∫Ä Server running on port ${PORT}`);
  console.log(`Ì≥ç Health: http://localhost:${PORT}/health`);
  console.log(`Ì≥ç API: http://localhost:${PORT}/api/employees`);
});
