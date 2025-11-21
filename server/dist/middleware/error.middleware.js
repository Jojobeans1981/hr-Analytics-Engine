"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const errorHandler = (err, req, res, next) => {
    logger_1.default.error(err.stack);
    res.status(500).send('Something broke!');
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const validationError = err;
        const errors = Object.values(validationError.errors).map(e => e.message);
        return res.status(400).json({
            error: 'Validation Error',
            details: errors
        });
    }
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
    }
    // MongoDB duplicate key error
    const mongoError = err;
    if (mongoError.code === 11000) {
        const field = Object.keys(mongoError.keyValue || {})[0];
        return res.status(400).json({
            error: `${field} already exists`
        });
    }
    // Default error
    const status = 'status' in err ? err.status : 500;
    res.status(status).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
exports.errorHandler = errorHandler;
