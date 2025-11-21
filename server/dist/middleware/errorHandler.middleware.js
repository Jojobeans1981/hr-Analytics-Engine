"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const apiError_1 = require("../errors/apiError");
const logger_1 = __importDefault(require("../utils/logger"));
const errorHandler = (err, req, res, next) => {
    if (err instanceof apiError_1.ApiError) {
        logger_1.default.error(`API Error: ${err.message}`, {
            status: err.statusCode,
            details: err.details,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
        return res.status(err.statusCode).json({
            error: {
                message: err.message,
                details: err.details,
                ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
            }
        });
    }
    logger_1.default.error('Unexpected error:', {
        message: err.message,
        stack: err.stack
    });
    res.status(500).json({
        error: {
            message: 'Internal Server Error',
            ...(process.env.NODE_ENV === 'development' && {
                details: err.message,
                stack: err.stack
            })
        }
    });
};
exports.errorHandler = errorHandler;
