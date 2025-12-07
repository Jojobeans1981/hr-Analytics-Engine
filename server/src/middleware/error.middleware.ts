import { ErrorRequestHandler } from 'express';
import logger from '../config/logger';

interface ValidationError extends Error {
  name: 'ValidationError';
  errors: Record<string, { message: string }>;
}

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, any>;
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error(err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const validationError = err as ValidationError;
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
  const mongoError = err as MongoError;
  if (mongoError.code === 11000) {
    const field = Object.keys(mongoError.keyValue || {})[0];
    return res.status(400).json({
      error: `${field} already exists`
    });
  }

  // Default error
  const status = 'status' in err ? (err as any).status : 500;
  return res.status(status).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
