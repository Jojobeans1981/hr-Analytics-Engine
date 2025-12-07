"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();

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

exports.default = router;
EOFcat > src/routes/risk.routes.js << 'EOF'
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();

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

exports.default = router;
