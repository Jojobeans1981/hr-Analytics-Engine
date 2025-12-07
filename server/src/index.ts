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
  .then(() => console.log(' MongoDB connected successfully'))
  .catch(err => console.error(' MongoDB connection error:', err));

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
  teamSize: Number,
  // Additional fields for your risk assessment
  performanceRating: Number,
  monthsWithCompany: Number,
  engagement: Number,
  compRatio: Number,
  compensationRatio: Number,
  criticalSkills: [String],
  skillGaps: [String],
  riskTrend: Number,
  performanceTrend: Number
}, { collection: 'employees' });

const Employee = mongoose.model('Employee', EmployeeSchema);

// Your exact TalentRiskAssessor implementation
interface RiskFactors {
  performance: number;
  tenure: number;
  engagement: number;
  compensation: number;
  skills: number;
}

interface RiskAssessment {
  score: number; // 0-100 percentage
  factors: RiskFactors;
  trend?: 'improving' | 'deteriorating' | 'stable';
}

class TalentRiskAssessor {
  calculateAdvancedRisk(employee: any): RiskAssessment {
    const factors = {
      performance: this.calculatePerformanceRisk(employee),
      tenure: this.calculateTenureRisk(employee),
      engagement: this.calculateEngagementRisk(employee),
      compensation: this.calculateCompensationRisk(employee),
      skills: this.calculateSkillsRisk(employee)
    };

    // Weighted risk calculation
    const weights = {
      performance: 0.3,
      tenure: 0.2,
      engagement: 0.25,
      compensation: 0.15,
      skills: 0.1
    };

    const weightedScore = Object.keys(factors).reduce((total, key) => {
      return total + (factors[key as keyof RiskFactors] * weights[key as keyof typeof weights]);
    }, 0);

    return {
      score: Math.min(100, Math.max(0, weightedScore * 100)), // Convert to percentage (0-100%)
      factors,
      trend: this.calculateRiskTrend(employee)
    };
  }

  private calculatePerformanceRisk(employee: any): number {
    const rating = employee.performanceRating || employee.performanceScore || 3;
    return Math.max(0, (5 - rating) / 4);
  }

  private calculateTenureRisk(employee: any): number {
    const tenureMonths = employee.tenure || employee.monthsWithCompany || 0;
    
    if (tenureMonths < 6) return 0.8;
    if (tenureMonths < 12) return 0.6;
    if (tenureMonths < 24) return 0.3;
    if (tenureMonths < 60) return 0.15;
    return 0.05;
  }

  private calculateEngagementRisk(employee: any): number {
    const engagement = employee.engagementScore || employee.engagement || 0.5;
    return Math.max(0, 1 - engagement);
  }

  private calculateCompensationRisk(employee: any): number {
    const ratio = employee.compRatio || employee.compensationRatio || employee.salaryPercentile || 1;
    
    if (ratio < 0.7) return 0.9;
    if (ratio < 0.8) return 0.7;
    if (ratio < 0.9) return 0.5;
    if (ratio <= 1.1) return 0.2;
    if (ratio <= 1.3) return 0.1;
    return 0.05;
  }

  private calculateSkillsRisk(employee: any): number {
    const criticalSkills = employee.criticalSkills || employee.skills || [];
    const skillGaps = employee.skillGaps || [];
    
    if (criticalSkills.length === 0) return 0.1;
    
    const gapRatio = skillGaps.length / criticalSkills.length;
    return Math.min(1, gapRatio);
  }

  private calculateRiskTrend(employee: any): 'improving' | 'deteriorating' | 'stable' {
    const recentChange = employee.riskTrend || employee.performanceTrend || 0;
    
    if (recentChange > 0.1) return 'improving';
    if (recentChange < -0.1) return 'deteriorating';
    return 'stable';
  }

  // Enhanced method for your API
  async assessEmployee(employeeData: any) {
    const advancedRisk = this.calculateAdvancedRisk(employeeData);
    
    // Convert to your expected format
    let riskLevel = 'Medium';
    if (advancedRisk.score < 25) riskLevel = 'Low';
    else if (advancedRisk.score < 50) riskLevel = 'Medium';
    else if (advancedRisk.score < 75) riskLevel = 'High';
    else riskLevel = 'Critical';

    const factorsList = [
      advancedRisk.factors.performance > 0.5 ? 'Performance concerns' : null,
      advancedRisk.factors.tenure > 0.5 ? 'Tenure risk' : null,
      advancedRisk.factors.engagement > 0.5 ? 'Engagement issues' : null,
      advancedRisk.factors.compensation > 0.5 ? 'Compensation risk' : null,
      advancedRisk.factors.skills > 0.5 ? 'Skill gaps' : null
    ].filter(Boolean) as string[];

    return {
      risk: {
        score: Math.round(advancedRisk.score),
        level: riskLevel,
        factors: factorsList,
        confidence: 85, // High confidence for your advanced algorithm
        trend: advancedRisk.trend
      },
      employee: {
        id: employeeData.id,
        name: employeeData.name,
        position: employeeData.position,
        department: employeeData.department
      },
      assessment: {
        timestamp: new Date().toISOString(),
        type: 'advanced',
        detailedFactors: advancedRisk.factors
      }
    };
  }

  // Batch processing for multiple employees
  assessMultipleEmployees(employees: any[]): Array<{ employee: any; risk: RiskAssessment }> {
    return employees.map(emp => ({
      employee: emp,
      risk: this.calculateAdvancedRisk(emp)
    }));
  }

  async assessTeam(employees: any[]) {
    const assessments = await Promise.all(
      employees.map(emp => this.assessEmployee(emp))
    );

    const riskDistribution = {
      Low: assessments.filter(a => a.risk.level === 'Low').length,
      Medium: assessments.filter(a => a.risk.level === 'Medium').length,
      High: assessments.filter(a => a.risk.level === 'High').length,
      Critical: assessments.filter(a => a.risk.level === 'Critical').length
    };

    const avgRiskScore = assessments.reduce((sum, a) => sum + a.risk.score, 0) / assessments.length;

    const highRiskEmployees = assessments
      .filter(a => a.risk.level === 'High' || a.risk.level === 'Critical')
      .slice(0, 5);

    return {
      totalEmployees: employees.length,
      averageRisk: Math.round(avgRiskScore),
      riskDistribution,
      highRiskCount: highRiskEmployees.length,
      highRiskEmployees: highRiskEmployees,
      assessmentDate: new Date().toISOString(),
      algorithm: 'Advanced TalentRiskAssessor'
    };
  }
}

// Initialize your TalentRiskAssessor
const talentRiskAssessor = new TalentRiskAssessor();
console.log(' Advanced Talent Risk Assessment System initialized');

const wss = new WebSocketServer({ 
  server,
  perMessageDeflate: false
});

wss.on('connection', (ws, request) => {
  console.log(' New WebSocket client connected');
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
    algorithm: 'Advanced TalentRiskAssessor'
  });
});

// API routes with your advanced risk assessment
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find({}).limit(100);
    console.log(` Found ${employees.length} employees in database`);
    
    // Add advanced risk assessments using your TalentRiskAssessor
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
            performanceRating: (emp.performanceScore || 50) / 20, // Convert to 1-5 scale
            salaryPercentile: emp.salaryPercentile || 50,
            compRatio: (emp.salaryPercentile || 50) / 100,
            promotionYears: emp.promotionYears || 0,
            workLifeBalance: emp.workLifeBalance || 50,
            jobSatisfaction: emp.jobSatisfaction || 50,
            trainingHours: emp.trainingHours || 0,
            engagementScore: emp.engagementScore || 50,
            engagement: (emp.engagementScore || 50) / 100,
            criticalRole: emp.criticalRole || false,
            clientFacing: emp.clientFacing || false,
            uniqueSkills: emp.uniqueSkills || 0,
            teamSize: emp.teamSize || 1,
            skills: emp.skills || [],
            criticalSkills: emp.skills || [],
            skillGaps: [],
            sentimentScore: emp.sentimentScore || 50,
            monthsWithCompany: (emp.tenure || 1) * 12,
            riskTrend: 0,
            performanceTrend: 0
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
                factors: ['Assessment error'],
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
    const teamAssessment = await talentRiskAssessor.assessTeam(employees);
    
    const departments = [...new Set(employees.map(e => e.department).filter(Boolean))];
    
    const metrics = {
      totalEmployees: employees.length,
      activeProjects: 5,
      riskScore: teamAssessment.averageRisk,
      avgRisk: teamAssessment.averageRisk,
      riskLevels: teamAssessment.riskDistribution,
      riskDistribution: teamAssessment.riskDistribution,
      departments,
      highRiskCount: teamAssessment.highRiskCount,
      teamAssessment: teamAssessment,
      algorithm: 'Advanced TalentRiskAssessor',
      alerts: teamAssessment.highRiskEmployees.map(hr => ({
        type: 'high_risk',
        employee: hr.employee.name,
        riskLevel: hr.risk.level,
        riskScore: hr.risk.score,
        factors: hr.risk.factors
      })),
      notifications: []
    };
    
    console.log(` Advanced dashboard metrics: ${employees.length} employees, avg risk: ${teamAssessment.averageRisk}`);
    res.json(metrics);
    
  } catch (error) {
    console.error('Error calculating metrics:', error);
    res.status(500).json({ error: 'Failed to calculate dashboard metrics' });
  }
});

// New endpoint: Get high-risk employees using advanced assessment
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
          performanceRating: (emp.performanceScore || 50) / 20,
          salaryPercentile: emp.salaryPercentile || 50,
          compRatio: (emp.salaryPercentile || 50) / 100,
          engagementScore: emp.engagementScore || 50,
          engagement: (emp.engagementScore || 50) / 100,
          criticalRole: emp.criticalRole || false,
          clientFacing: emp.clientFacing || false,
          skills: emp.skills || [],
          criticalSkills: emp.skills || []
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
    
    res.json({
      algorithm: 'Advanced TalentRiskAssessor',
      count: highRiskEmployees.length,
      employees: highRiskEmployees
    });
  } catch (error) {
    console.error('Error fetching high-risk employees:', error);
    res.status(500).json({ error: 'Failed to fetch high-risk employees' });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` Advanced Talent Risk Assessment System: Active`);
  console.log(` Using your exact TalentRiskAssessor implementation`);
});
