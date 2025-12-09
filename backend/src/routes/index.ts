import { Router } from 'express';
import authRoutes from './auth.routes';
import employeesRoutes from './employees.route'; // Your actual file
import riskRoutes from './risk.routes';
import analysisRoutes from './analysis.route';
import dashboardRoutes from './dashboard.routes';
import skillsRoutes from './skills.routes';
import sentimentRoutes from './sentiment.routes';
import teamRoutes from './team.routes';
import assessmentRoutes from './assessment.routes';
import docsRoutes from './docs.routes';

const router = Router();

// API Routes - Using your actual filenames
router.use('/auth', authRoutes);
router.use('/employees', employeesRoutes); // This matches employees.route.ts
router.use('/risk', riskRoutes);
router.use('/analysis', analysisRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/skills', skillsRoutes);
router.use('/sentiment', sentimentRoutes);
router.use('/teams', teamRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/docs', docsRoutes);

// API Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Talent Risk AI API',
    version: '1.0.0'
  });
});

// API Documentation
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Talent Risk AI API',
    version: '1.0.0',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        logout: 'POST /api/auth/logout',
        verify: 'GET /api/auth/verify'
      },
      employees: {
        getAll: 'GET /api/employees',
        getById: 'GET /api/employees/:id',
        highRisk: 'GET /api/employees/high-risk',
        riskBreakdown: 'GET /api/employees/risk-breakdown'
      },
      risk: {
        assessment: 'GET /api/risk/assessment/:employeeId',
        calculate: 'POST /api/risk/calculate',
        trends: 'GET /api/risk/trends'
      },
      dashboard: 'GET /api/dashboard',
      analysis: 'GET /api/analysis/dashboard'
    }
  });
});

export default router;