"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = exports.requestLogger = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger_1.default.info(`${req.method} ${req.originalUrl} - ${res.statusCode} ${duration}ms`);
    });
    next();
};
exports.requestLogger = requestLogger;
const errorLogger = (err, req, res, next) => {
    logger_1.default.error(`Error: ${err.message}`);
    next(err);
};
exports.errorLogger = errorLogger;
