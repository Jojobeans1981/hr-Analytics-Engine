"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const http_1 = require("http");
const ws_1 = require("ws");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app); // Create HTTP server from Express app
// WebSocket Server - integrated with Express
const wss = new ws_1.WebSocketServer({
    server, // Use the same server as Express
    perMessageDeflate: false
});
console.log('��� Starting integrated Express + WebSocket server...');
// WebSocket connection handler
wss.on('connection', (ws, request) => {
    const clientIP = request.socket.remoteAddress;
    console.log('��� New WebSocket client connected');
    console.log('��� Client IP:', clientIP);
    console.log('��� Total connections:', wss.clients.size);
    // Send welcome message
    ws.send(JSON.stringify({
        type: 'connected',
        message: 'WebSocket connection established',
        timestamp: new Date().toISOString(),
        totalConnections: wss.clients.size
    }));
    ws.on('message', (data) => {
        try {
            const message = data.toString();
            console.log('��� Received WebSocket message:', message);
            // Try to parse as JSON
            let parsedMessage;
            try {
                parsedMessage = JSON.parse(message);
            }
            catch {
                parsedMessage = { type: 'text', content: message };
            }
            // Handle different message types
            switch (parsedMessage.type) {
                case 'ping':
                    ws.send(JSON.stringify({
                        type: 'pong',
                        timestamp: new Date().toISOString()
                    }));
                    break;
                case 'get_employees':
                    ws.send(JSON.stringify({
                        type: 'employees_data',
                        data: [
                            { id: 1, name: 'John Doe', riskScore: 25, riskLevel: 'Low' },
                            { id: 2, name: 'Jane Smith', riskScore: 65, riskLevel: 'Medium' }
                        ],
                        timestamp: new Date().toISOString()
                    }));
                    break;
                default:
                    // Echo back
                    ws.send(JSON.stringify({
                        type: 'echo',
                        message: `Server received: ${message}`,
                        timestamp: new Date().toISOString()
                    }));
            }
        }
        catch (error) {
            console.error('Error processing message:', error);
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Failed to process message',
                timestamp: new Date().toISOString()
            }));
        }
    });
    ws.on('close', (code, reason) => {
        console.log('��� WebSocket client disconnected');
        console.log('��� Close code:', code, 'Reason:', reason?.toString());
        console.log('��� Total connections:', wss.clients.size);
    });
    ws.on('error', (error) => {
        console.error('❌ WebSocket error:', error);
    });
});
// Express Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['*']
}));
app.use(express_1.default.json());
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        websocket: {
            active: true,
            connections: wss.clients.size
        }
    });
});
// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Prometheus Talent Engine API',
        version: '1.0.0',
        status: 'running',
        websocket: 'available'
    });
});
// API routes
app.get('/api/employees', (req, res) => {
    res.json([
        {
            id: 1,
            name: 'John Doe',
            position: 'Developer',
            riskLevel: 'Low',
            department: 'Engineering'
        },
        {
            id: 2,
            name: 'Jane Smith',
            position: 'Designer',
            riskLevel: 'Medium',
            department: 'Design'
        }
    ]);
});
app.get('/api/dashboard-metrics', (req, res) => {
    res.json({
        totalEmployees: 2,
        activeProjects: 5,
        riskScore: 3.2,
        riskLevel: {
            Low: 1,
            Medium: 1,
            High: 0,
            Critical: 0
        },
        departments: {
            Engineering: 1,
            Design: 1
        }
    });
});
// Handle preflight requests
app.options('*', (0, cors_1.default)());
// Start the integrated server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`��� Server running on port ${PORT}`);
    console.log(`��� Health: http://localhost:${PORT}/health`);
    console.log(`��� API: http://localhost:${PORT}/api/employees`);
    console.log(`�� WebSocket: ws://localhost:${PORT}/`);
    console.log(`��� Express + WebSocket integrated successfully`);
});
