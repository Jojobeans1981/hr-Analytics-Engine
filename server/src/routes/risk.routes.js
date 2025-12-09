"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();

// Risk assessment routes
router.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Risk assessment API is operational',
        version: '1.0.0',
        endpoints: [
            { method: 'GET', path: '/api/risk', description: 'Get risk overview' },
            { method: 'POST', path: '/api/risk/assess', description: 'Assess new risk' },
            { method: 'GET', path: '/api/risk/metrics', description: 'Get risk metrics' }
        ]
    });
});

// Dashboard metrics route
router.get('/dashboard-metrics', (req, res) => {
  res.json({
    atRiskEmployees: 5,
    highRiskProjects: 3,
    avgRiskScore: 78.4,
    retentionRate: 92.5
  });
});

module.exports = router;
