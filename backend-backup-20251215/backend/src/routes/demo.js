const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Demo endpoint - shows only 5 employees
router.get('/demo/employees', async (req, res) => {
  try {
    // Get only 5 employees for demo
    const employees = await Employee.find({}).limit(5);
    
    res.json({
      success: true,
      count: employees.length,
      data: employees,
      message: 'Demo version - limited to 5 records',
      version: 'demo'
    });
  } catch (error) {
    res.status(500).json({ error: 'Demo data error' });
  }
});

// Demo health check
router.get('/demo/health', (req, res) => {
  res.json({
    status: 'demo-healthy',
    message: 'Prometheus Demo API',
    limit: '5 employee records visible',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
