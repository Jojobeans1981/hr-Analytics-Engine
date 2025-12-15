const express = require('express');
const router = express.Router();
const demoAuth = require('../middleware/demoAuth');

// Mock data for demo (no database dependency)
const mockEmployees = [
  {
    id: 'DEMO001',
    employeeId: 'EMP1001',
    name: 'Alex Johnson',
    department: 'Engineering',
    role: 'Senior Developer',
    riskScore: 45,
    riskLevel: 'medium',
    performanceRating: 4.2,
    tenureMonths: 24,
    email: 'alex.johnson@company.com',
    engagementScore: 78,
    lastPromotionMonths: 8,
    compensationRatio: 1.1,
    criticalSkills: ['React', 'Node.js', 'TypeScript'],
    skillGaps: ['AWS', 'Docker'],
    trainingNeeds: ['Leadership'],
  },
  {
    id: 'DEMO002',
    employeeId: 'EMP1002',
    name: 'Maria Garcia',
    department: 'Marketing',
    role: 'Marketing Manager',
    riskScore: 28,
    riskLevel: 'low',
    performanceRating: 4.5,
    tenureMonths: 18,
    email: 'maria.garcia@company.com',
    engagementScore: 85,
    lastPromotionMonths: 6,
    compensationRatio: 1.2,
    criticalSkills: ['SEO', 'Content Strategy', 'Analytics'],
    skillGaps: ['Data Visualization'],
    trainingNeeds: ['Public Speaking'],
  },
  {
    id: 'DEMO003',
    employeeId: 'EMP1003',
    name: 'David Chen',
    department: 'Sales',
    role: 'Account Executive',
    riskScore: 67,
    riskLevel: 'high',
    performanceRating: 3.8,
    tenureMonths: 36,
    email: 'david.chen@company.com',
    engagementScore: 65,
    lastPromotionMonths: 24,
    compensationRatio: 0.9,
    criticalSkills: ['Negotiation', 'CRM', 'Client Relations'],
    skillGaps: ['Data Analysis'],
    trainingNeeds: ['Advanced Sales Techniques'],
  },
  {
    id: 'DEMO004',
    employeeId: 'EMP1004',
    name: 'Sarah Williams',
    department: 'HR',
    role: 'HR Specialist',
    riskScore: 22,
    riskLevel: 'low',
    performanceRating: 4.7,
    tenureMonths: 12,
    email: 'sarah.williams@company.com',
    engagementScore: 90,
    lastPromotionMonths: 3,
    compensationRatio: 1.0,
    criticalSkills: ['Recruitment', 'Employee Relations', 'Compliance'],
    skillGaps: ['HR Analytics'],
    trainingNeeds: ['Conflict Resolution'],
  },
  {
    id: 'DEMO005',
    employeeId: 'EMP1005',
    name: 'James Wilson',
    department: 'Engineering',
    role: 'DevOps Engineer',
    riskScore: 52,
    riskLevel: 'medium',
    performanceRating: 4.0,
    tenureMonths: 30,
    email: 'james.wilson@company.com',
    engagementScore: 72,
    lastPromotionMonths: 18,
    compensationRatio: 1.15,
    criticalSkills: ['Docker', 'Kubernetes', 'AWS'],
    skillGaps: ['Python', 'Machine Learning'],
    trainingNeeds: ['Cloud Architecture'],
  },
];

// ALL demo routes protected
router.use(demoAuth);

// Demo endpoint - shows only 5 employees
router.get('/demo/employees', async (req, res) => {
  try {
    res.json({
      success: true,
      count: mockEmployees.length,
      data: mockEmployees,
      message: 'Demo version - showing 5 sample records',
      version: 'demo',
      user: req.auth.user,
      disclaimer: 'This is mock data for demonstration purposes only',
    });
  } catch (error) {
    console.error('Demo error:', error);
    res.status(500).json({ error: 'Demo data error' });
  }
});

// Demo health check
router.get('/demo/health', (req, res) => {
  res.json({
    status: 'demo-healthy',
    message: 'Prometheus Demo API',
    limit: '5 sample records (mock data)',
    user: req.auth.user,
    timestamp: new Date().toISOString(),
    note: 'Using mock data for demo purposes',
    endpoints: {
      employees: '/api/demo/employees',
      health: '/api/demo/health',
    },
  });
});

module.exports = router;
