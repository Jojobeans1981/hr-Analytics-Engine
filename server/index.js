"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const ws_1 = __importStar(require("ws"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const mongoose_1 = __importDefault(require("mongoose"));
const risk_routes_1 = __importDefault(require("./src/routes/risk.routes"));
const employees_route_1 = __importDefault(require("./src/routes/employees.route"));
const dashboard_routes_1 = __importDefault(require("./src/routes/dashboard.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
const allowedOrigins = [
    'https://dashboard-new-eta-blond.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
];
const corsOptions = {
    origin(origin, callback) {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        console.log('Blocked by CORS:', origin);
        return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
app.use((0, cors_1.default)(corsOptions));
app.options('*', (0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
console.log('🔍 Environment variables check:');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('All env vars:', Object.keys(process.env));
const server = http_1.default.createServer(app);
const wss = new ws_1.Server({
    server,
    perMessageDeflate: false,
});
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use((0, compression_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
        origin: req.headers.origin,
        'user-agent': req.headers['user-agent'],
    });
    next();
});
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined'));
}
const connectDB = async () => {
    try {
        if (process.env.MONGODB_URI) {
            const conn = await mongoose_1.default.connect(process.env.MONGODB_URI);
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        }
        else {
            console.log('No MongoDB URI provided, running without database');
        }
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        nodeVersion: process.version,
        websocketConnections: wss.clients.size,
    });
});
app.get('/api/data', (req, res) => {
    res.json({
        message: 'Hello from the backend!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
});
app.use('/api/risk/employees', employees_route_1.default);
app.use('/api/risk', risk_routes_1.default);
app.use('/api/employees', employees_route_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.get('/', (req, res) => {
    res.json({
        message: 'Talent Risk Assessment API Server',
        version: '1.0.0',
        environment: process.env.NODE_ENV,
        endpoints: {
            health: '/api/health',
            data: '/api/data',
            risk: '/api/risk/*',
            employees: '/api/employees',
            dashboard: '/api/dashboard',
            websocket: `ws://localhost:${port}`,
        },
    });
});
wss.on('connection', (ws, request) => {
    console.log('🔌 New WebSocket client connected');
    console.log(`📍 Total connections: ${wss.clients.size}`);
    const clientIP = request.socket.remoteAddress;
    console.log(`📍 Client IP: ${clientIP}`);
    ws.send(JSON.stringify({
        type: 'welcome',
        message: 'Connected to WebSocket server',
        timestamp: new Date().toISOString(),
        connectionId: Math.random().toString(36).substr(2, 9),
        totalConnections: wss.clients.size,
    }));
    ws.on('message', (data) => {
        try {
            const message = data.toString();
            console.log('📨 Received message:', message);
            let parsedMessage;
            try {
                parsedMessage = JSON.parse(message);
            }
            catch {
                parsedMessage = { text: message };
            }
            ws.send(JSON.stringify({
                type: 'echo',
                originalMessage: parsedMessage,
                timestamp: new Date().toISOString(),
                server: 'Talent Risk API',
            }));
            broadcastToAll(JSON.stringify({
                type: 'broadcast',
                message: 'User sent: ' +
                    (typeof parsedMessage === 'object'
                        ? JSON.stringify(parsedMessage)
                        : parsedMessage),
                timestamp: new Date().toISOString(),
                connections: wss.clients.size,
            }), ws);
        }
        catch (error) {
            console.error('Error processing message:', error);
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Failed to process your message',
                timestamp: new Date().toISOString(),
            }));
        }
    });
    ws.on('close', (code, reason) => {
        console.log('🔌 WebSocket client disconnected');
        console.log(`📍 Total connections: ${wss.clients.size}`);
        console.log(`📍 Close code: ${code}, Reason: ${reason}`);
    });
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
    const interval = setInterval(() => {
        if (ws.readyState === ws_1.default.OPEN) {
            ws.send(JSON.stringify({
                type: 'heartbeat',
                timestamp: new Date().toISOString(),
                connections: wss.clients.size,
                uptime: process.uptime(),
            }));
        }
    }, 30000);
    ws.on('close', () => {
        clearInterval(interval);
    });
});
function broadcastToAll(message, excludeWs) {
    wss.clients.forEach((client) => {
        if (client !== excludeWs && client.readyState === ws_1.default.OPEN) {
            client.send(message);
        }
    });
}
app.get('/api/websocket/clients', (req, res) => {
    const clients = Array.from(wss.clients).map((client) => ({
        readyState: client.readyState === ws_1.default.OPEN
            ? 'open'
            : client.readyState === ws_1.default.CONNECTING
                ? 'connecting'
                : client.readyState === ws_1.default.CLOSING
                    ? 'closing'
                    : 'closed',
    }));
    res.json({
        totalConnections: wss.clients.size,
        openConnections: clients.filter((c) => c.readyState === 'open')
            .length,
        clients,
    });
});
app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Route not found',
        path: req.originalUrl,
        availableEndpoints: [
            'GET /',
            'GET /api/health',
            'GET /api/data',
            'GET /api/websocket/clients',
        ],
    });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'production' ? {} : err.message,
    });
});
const startServer = async () => {
    try {
        if (process.env.MONGODB_URI) {
            await connectDB();
        }
        server.listen(port, () => {
            console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${port}`);
            console.log(`📍 HTTP API: http://localhost:${port}`);
            console.log(`🔌 WebSocket: ws://localhost:${port}`);
            console.log(`❤️  Health check: http://localhost:${port}/api/health`);
            console.log(`📊 WebSocket clients: http://localhost:${port}/api/websocket/clients`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});
startServer();
exports.default = app;
