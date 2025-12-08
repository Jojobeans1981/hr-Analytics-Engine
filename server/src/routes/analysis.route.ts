import { Router } from 'express';
const router = Router();

// GET analysis dashboard
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      metrics: {
        totalEmployees: 145,
        highRiskEmployees: 12,
        avgRiskScore: 5.8,
        predictedTurnover: '8.2%'
      },
      departmentBreakdown: [
        { department: 'Engineering', riskScore: 7.2, employeeCount: 52 },
        { department: 'Sales', riskScore: 6.1, employeeCount: 38 },
        { department: 'Marketing', riskScore: 4.8, employeeCount: 25 },
        { department: 'Operations', riskScore: 4.2, employeeCount: 30 }
      ]
    }
  });
});

// GET predictive analytics
router.get('/predictive', (req, res) => {
  res.json({
    success: true,
    data: {
      turnoverPrediction: [
        { month: 'January', predicted: 3, actual: 2 },
        { month: 'February', predicted: 4, actual: null },
        { month: 'March', predicted: 5, actual: null }
      ],
      riskForecast: {
        next30Days: {
          highRiskIncrease: 15,
          keyFactors: ['Market competition', 'Compensation gaps']
        }
      }
    }
  });
});

export default router;