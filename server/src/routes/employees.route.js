"use strict";
const express = require("express");
const router = express.Router();

// Employees routes
router.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Employees API is operational',
        endpoints: [
            { method: 'GET', path: '/api/employees', description: 'Get all employees' },
            { method: 'GET', path: '/api/employees/:id', description: 'Get employee by ID' },
            { method: 'POST', path: '/api/employees', description: 'Create new employee' }
        ]
    });
});

module.exports = router;
