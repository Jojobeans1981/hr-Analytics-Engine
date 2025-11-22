"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const security_middleware_js_1 = require("./middleware/security.middleware.js");
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)(security_middleware_js_1.corsOptions));
app.use(express_1.default.json());
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Prometheus Talent Engine API',
        version: '1.0.0',
        status: 'running'
    });
});
// API routes
app.get('/api/employees', (req, res) => {
    res.json([
        { id: 1, name: 'John Doe', position: 'Developer' },
        { id: 2, name: 'Jane Smith', position: 'Designer' }
    ]);
});
app.get('/api/dashboard-metrics', (req, res) => {
    res.json({
        totalEmployees: 2,
        activeProjects: 5,
        riskScore: 3.2
    });
});
// Handle preflight requests
app.options('*', (0, cors_1.default)(security_middleware_js_1.corsOptions));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`��� Server running on port ${PORT}`);
    console.log(`��� Health: http://localhost:${PORT}/health`);
    console.log(`��� API: http://localhost:${PORT}/api/employees`);
});
