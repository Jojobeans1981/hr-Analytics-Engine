import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import your actual TypeScript implementations
import { TalentRiskAssessor } from '../server/src/utils/TalentRiskAssessor';
import { RiskPredictor } from '../server/src/utils/RiskPredictor';

dotenv.config();

const app = express();
const server = createServer(app);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/prometheus';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('‚úÖ MongoDB connected successfully'))
  .catch(err => console.error('‚ùå MongoDB connection error:', err));

// Employee model
const EmployeeSchema = new mongoose.Schema({
  name: String,
  position: String,
  department: String,
  riskLevel: String,
  riskScore: Number,
  status: String,
  skills: [String],
  performanceScore: Number,
  tenure: Number,
  sentimentScore: Number,
  salaryPercentile: Number,
  promotionYears: Number,
  workLifeBalance: Number,
  jobSatisfaction: Number,
  trainingHours: Number,
  engagementScore: Number,
  criticalRole: Boolean,
  clientFacing: Boolean,
  uniqueSkills: Number,
  teamSize: Number
}, { collection: 'employees' });

const Employee = mongoose.model('Employee', EmployeeSchema);

// Initialize your actual TypeScript risk assessment system
let riskPredictor: RiskPredictor;
let talentRiskAssessor: TalentRiskAssessor;

try {
  riskPredictor = new RiskPredictor();
  talentRiskAssessor = new TalentRiskAssessor();
  console.log('ÌæØ TypeScript Talent Risk Assessment System initialized successfully');
} catch (error) {
  console.error('‚ùå Failed to initialize TypeScript risk assessment system:', error);
  // Create simple fallback
  talentRiskAssessor = {
    assessEmployee: async (emp: any) => ({
      risk: { score: 50, level: 'Medium', factors: ['Fallback assessment'] }
    })
  } as TalentRiskAssessor;
}

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
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    riskAssessment: 'active',
    typescript: true
  });
});

// Enhanced API routes with your actual TypeScript TalentRiskAssessor
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find({}).limit(100);
    console.log(`Ì≥ä Found ${employees.length} employees in database`);
    
    // Add risk assessments using your actual TypeScript TalentRiskAssessor
    const employeesWithRisk = await Promise.all(
      employees.map(async (emp) => {
        try {
          const employeeData = {
            id: emp._id.toString(),
            name: emp.name,
            position: emp.position,
            department: emp.department,
            tenure: emp.tenure || 1,
            performanceScore: emp.performanceScore || 50,
            salaryPercentile: emp.salaryPercentile || 50,
            promotionYears: emp.promotionYears || 0,
            workLifeBalance: emp.workLifeBalance || 50,
            jobSatisfaction: emp.jobSatisfaction || 50,
            trainingHours: emp.trainingHours || 0,
            engagementScore: emp.engagementScore || 50,
            criticalRole: emp.criticalRole || false,
            clientFacing: emp.clientFacing || false,
            uniqueSkills: emp.uniqueSkills || 0,
            teamSize: emp.teamSize || 1,
            skills: emp.skills || [],
            sentimentScore: emp.sentimentScore || 50
          };

          const assessment = await talentRiskAssessor.assessEmployee(employeeData);
          
          return {
            ...emp.toObject(),
            riskAssessment: assessment
          };
        } catch (error) {
          console.error(`Error assessing employee ${emp.name}:`, error);
          return {
            ...emp.toObject(),
            riskAssessment: {
              risk: {
                score: 50,
                level: 'Medium',
                factors: ['Assessment error - using fallback'],
                confidence: 0
              }
            }
          };
        }
      })
    );
    
    res.json(employeesWithRisk);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

app.get('/api/dashboard-metrics', async (req, res) => {
  try {
    const employees = await Employee.find({});
    
    // Get assessments for all employees
    const assessments = await Promise.all(
      employees.map(async (emp) => {
        const employeeData = {
          id: emp._id.toString(),
          name: emp.name,
          position: emp.position,
          department: emp.department,
          tenure: emp.tenure || 1,
          performanceScore: emp.performanceScore || 50,
          salaryPercentile: emp.salaryPercentile || 50,
          promotionYears: emp.promotionYears || 0,
          workLifeBalance: emp.workLifeBalance || 50,
          jobSatisfaction: emp.jobSatisfaction || 50,
          trainingHours: emp.trainingHours || 0,
          engagementScore: emp.engagementScore || 50,
          criticalRole: emp.criticalRole || false,
          clientFacing: emp.clientFacing || false,
          uniqueSkills: emp.uniqueSkills || 0,
          teamSize: emp.teamSize || 1
        };

        return await talentRiskAssessor.assessEmployee(employeeData);
      })
    );

    // Calculate team metrics
    const riskDistribution = {
      Low: assessments.filter(a => a.risk.level === 'Low').length,
      Medium: assessments.filter(a => a.risk.level === 'Medium').length,
      High: assessments.filter(a => a.risk.level === 'High').length,
      Critical: assessments.filter(a => a.risk.level === 'Critical').length
    };
    
    const avgRiskScore = assessments.reduce((sum, a) => sum + a.risk.score, 0) / assessments.length;
    
    const departments = [...new Set(employees.map(e => e.department).filter(Boolean))];
    
    const highRiskEmployees = assessments
      .filter(a => a.risk.level === 'High' || a.risk.level === 'Critical')
      .slice(0, 5);

    const metrics = {
      totalEmployees: employees.length,
      activeProjects: 5,
      riskScore: Math.round(avgRiskScore),
      avgRisk: Math.round(avgRiskScore),
      riskLevels: riskDistribution,
      riskDistribution: riskDistribution,
      departments,
      highRiskCount: highRiskEmployees.length,
      teamAssessment: {
        averageRisk: Math.round(avgRiskScore),
        riskDistribution,
        highRiskCount: highRiskEmployees.length
      },
      alerts: highRiskEmployees.map(assessment => ({
        type: 'high_risk',
        riskLevel: assessment.risk.level,
        riskScore: assessment.risk.score,
        factors: assessment.risk.factors || []
      })),
      notifications: []
    };
    
    console.log(`Ì≥à Dashboard metrics: ${employees.length} employees, avg risk: ${Math.round(avgRiskScore)}`);
    res.json(metrics);
    
  } catch (error) {
    console.error('Error calculating metrics:', error);
    res.status(500).json({ error: 'Failed to calculate dashboard metrics' });
  }
});

// New endpoint: Get high-risk employees with details
app.get('/api/employees/high-risk', async (req, res) => {
  try {
    const employees = await Employee.find({});
    
    const employeesWithAssessments = await Promise.all(
      employees.map(async (emp) => {
        const employeeData = {
          id: emp._id.toString(),
          name: emp.name,
          position: emp.position,
          department: emp.department,
          tenure: emp.tenure || 1,
          performanceScore: emp.performanceScore || 50,
          salaryPercentile: emp.salaryPercentile || 50,
          promotionYears: emp.promotionYears || 0,
          workLifeBalance: emp.workLifeBalance || 50,
          jobSatisfaction: emp.jobSatisfaction || 50,
          trainingHours: emp.trainingHours || 0,
          engagementScore: emp.engagementScore || 50,
          criticalRole: emp.criticalRole || false,
          clientFacing: emp.clientFacing || false,
          uniqueSkills: emp.uniqueSkills || 0,
          teamSize: emp.teamSize || 1
        };

        const assessment = await talentRiskAssessor.assessEmployee(employeeData);
        
        return {
          employee: emp.toObject(),
          assessment
        };
      })
    );
    
    const highRiskEmployees = employeesWithAssessments
      .filter(item => 
        item.assessment.risk.level === 'High' || 
        item.assessment.risk.level === 'Critical'
      )
      .sort((a, b) => b.assessment.risk.score - a.assessment.risk.score);
    
    res.json(highRiskEmployees);
  } catch (error) {
    console.error('Error fetching high-risk employees:', error);
    res.status(500).json({ error: 'Failed to fetch high-risk employees' });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Ì∫Ä Server running on port ${PORT}`);
  console.log(`Ì≥ç TypeScript Talent Risk Assessment System: Active`);
});
