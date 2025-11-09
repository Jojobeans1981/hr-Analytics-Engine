const express = require('express');
const router = express.Router();

const assessmentRoutes = require('./assessment.routes');
const employeeRoutes = require('./employee.routes.ts');
const teamRoutes = require('./team.routes');
const authRoutes = require('./auth.routes');
const docsRoutes = require('./docs.routes');

// Mount routes
router.use('/assessments', assessmentRoutes);
router.use('/employees', employeeRoutes);
router.use('/teams', teamRoutes);
router.use('/auth', authRoutes);
router.use('/docs', docsRoutes);

// Base route
router.get('/', (req, res) => {
  res.json({
    message: 'Talent Risk Assessment API',
    version: '1.0.0',
    endpoints: {
      assessments: '/api/assessments',
      employees: '/api/employees',
      teams: '/api/teams',
      auth: '/api/auth',
      docs: '/api/docs'
    }
  });
});

module.exports = router;