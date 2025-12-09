import winston from 'winston';
import morgan from 'morgan';
import { Request, Response, NextFunction } from 'express';

// Create logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Morgan stream configuration
const morganStream = {
  write: (message: string) => {
    logger.info(message.trim());
  }
};

// Request logger middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip
  });
  next();
};

// Morgan middleware
export const morganMiddleware = morgan('combined', { stream: morganStream });

export default logger;