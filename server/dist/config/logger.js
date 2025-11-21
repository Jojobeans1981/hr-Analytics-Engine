"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.morganMiddleware = exports.requestLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const morgan_1 = __importDefault(require("morgan"));
// Create logger instance
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({ filename: 'logs/combined.log' })
    ]
});
// Morgan stream configuration
const morganStream = {
    write: (message) => {
        logger.info(message.trim());
    }
};
// Request logger middleware
const requestLogger = (req, res, next) => {
    logger.info({
        method: req.method,
        url: req.url,
        ip: req.ip
    });
    next();
};
exports.requestLogger = requestLogger;
// Morgan middleware
exports.morganMiddleware = (0, morgan_1.default)('combined', { stream: morganStream });
exports.default = logger;
