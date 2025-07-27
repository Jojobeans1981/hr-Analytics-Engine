const express = require('express');
const router = express.Router();

// GET auth status
router.get('/', (req, res) => {
  res.json({
    message: 'Authentication endpoint',
    endpoints: {
      login: 'POST /api/auth/login',
      register: 'POST /api/auth/register',
      logout: 'POST /api/auth/logout',
      refresh: 'POST /api/auth/refresh'
    }
  });
});

// POST login
router.post('/login', (req, res) => {
  res.json({
    message: 'Login endpoint',
    received: req.body,
    note: 'Auth not implemented - would return JWT token'
  });
});

// POST register
router.post('/register', (req, res) => {
  res.json({
    message: 'Register endpoint',
    received: req.body,
    note: 'Auth not implemented - would create user'
  });
});

module.exports = router;
