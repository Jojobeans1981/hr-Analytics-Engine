const express = require('express');
const router = express.Router();

// Basic documentation route
router.get('/', (req, res) => {
  res.json({
    title: 'Talent Risk Assessment API',
    version: '1.0.0',
    description: 'API for assessing employee flight risk and team health',
    endpoints: {
      base: process.env.API_URL || 'http://localhost:3000',
      docs: '/api/docs',
      health: '/health'
    }
  });
});

module.exports = router;