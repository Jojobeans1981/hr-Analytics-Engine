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

module.exports = router;
