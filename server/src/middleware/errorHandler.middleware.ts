import { ErrorRequestHandler } from 'express';
import { ApiError } from '../errors/apiError';
import logger from '../utils/logger';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    logger.error(`API Error: ${err.message}`, {
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

  logger.error('Unexpected error:', {
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