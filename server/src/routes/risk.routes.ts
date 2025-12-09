import { Router } from 'express';
const router = Router();

// GET risk assessment for employee
router.get('/employee/:employeeId', (req, res) => {
  res.json({
    success: true,
    data: {
      employeeId: req.params.employeeId,
      overallRisk: 7.2,
      category: 'Medium Risk',
      factors: [
        { name: 'Tenure', score: 8, weight: 0.3, details: '2 years with company' },
        { name: 'Performance', score: 6, weight: 0.25, details: 'Meets expectations' },
        { name: 'Compensation Ratio', score: 9, weight: 0.2, details: 'Below market average' },
        { name: 'Engagement', score: 5, weight: 0.25, details: 'Moderate engagement score' }
      ],
      recommendations: [
        'Review compensation package',
        'Schedule career development discussion',
        'Consider retention bonus'
      ]
    }
  });
});

// POST calculate risk
router.post('/calculate', (req, res) => {
  const { employeeId, data } = req.body;
  res.json({
    success: true,
    data: {
      employeeId,
      riskScore: 7.8,
      confidence: 0.87,
      calculationDate: new Date().toISOString(),
      inputData: data
    }
  });
});

// GET risk trends
router.get('/trends', (req, res) => {
  res.json({
    success: true,
    data: {
      period: 'Last 30 days',
      summary: {
        highRisk: { count: 12, change: '+2' },
        mediumRisk: { count: 35, change: '-1' },
        lowRisk: { count: 98, change: '+5' }
      },
      trends: [
        { date: '2024-01-01', avgRisk: 5.2 },
        { date: '2024-01-08', avgRisk: 5.5 },
        { date: '2024-01-15', avgRisk: 5.8 }
      ]
    }
  });
});

export default router;