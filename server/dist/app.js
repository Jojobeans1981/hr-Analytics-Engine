"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Routes (adjust based on your structure)
const index_js_1 = __importDefault(require("./routes/index.js"));
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)());
// // app.use(cors({
origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials;
true;
;
app.use((0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express_1.default.json());
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('combined'));
// Routes
app.use('/api', index_js_1.default);
// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});
exports.default = app;
