"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Basic documentation route
router.get('/', (req, res) => {
    res.json({
        success: true,
        title: 'Talent Risk Assessment API',
        version: '1.0.0',
        description: 'API for assessing employee flight risk and team health',
        endpoints: {
            base: process.env.API_URL || 'http://localhost:3000',
            docs: '/api/docs',
            health: '/health',
            assessments: '/api/assessments',
            employees: '/api/employees',
            teams: '/api/teams',
            auth: '/api/auth'
        },
        documentation: 'https://github.com/your-repo/docs'
    });
});
exports.default = router;
