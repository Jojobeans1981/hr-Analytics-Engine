import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { MongoClient, Db } from 'mongodb';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
let db: Db | null = null;

const connectDB = async (): Promise<Db> => {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prometheus', {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      },
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Connected...');
    db = client.db();
    if (!db) throw new Error('Failed to connect to database');
    return db;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  }
};

// API Routes - FIXED THE ROUTE PATH
app.get('/api/dashboard-metrics', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }

    // Get employees collection
    const employees = await db.collection('employees').find({}).toArray();
    
    // Calculate metrics
    const totalEmployees = employees.length;
    const avgRisk = employees.reduce((sum: number, emp: any) => sum + (emp.riskScore || 0), 0) / totalEmployees;
    const departments = [...new Set(employees.map((emp: any) => emp.department))];
    
    const riskLevels = {
      Low: employees.filter((emp: any) => emp.riskLevel === 'Low').length,
      Medium: employees.filter((emp: any) => emp.riskLevel === 'Medium').length,
      High: employees.filter((emp: any) => emp.riskLevel === 'High').length
    };

    res.json({
      totalEmployees,
      avgRisk,
      departments,
      riskLevels
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});

app.get('/api/employees', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }

    const employees = await db.collection('employees').find({}).toArray();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start Server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 API available at http://localhost:${PORT}/api`);
    console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
  });
};

startServer().catch(console.error);