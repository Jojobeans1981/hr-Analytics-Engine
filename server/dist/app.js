"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// CORS configuration that handles multiple origins and headers
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = process.env.CLIENT_URL?.split(',') || [
            'http://localhost:3000',
            'https://dashboard-new-eta-blond.vercel.app',
            'https://dashboard-gfjo6f4rg-joseph-panettas-projects.vercel.app'
        ];
        // Allow requests with no origin
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Allow-Headers',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
        'Cache-Control',
        'Pragma',
        'If-Modified-Since',
        'If-None-Match'
    ],
    exposedHeaders: [
        'Content-Range',
        'X-Content-Range',
        'Content-Length',
        'ETag'
    ],
    optionsSuccessStatus: 200
};
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// Handle preflight requests
app.options('*', (0, cors_1.default)(corsOptions));
// Basic health check route
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
