import { ApiError } from '../errors/apiError';

export function handleError(error: unknown): { 
  status: number; 
  message: string; 
  details?: any 
} {
  if (error instanceof ApiError) {
    return {
      status: error.statusCode,
      message: error.message,
      details: error.details
    };
  }

  if (error instanceof Error) {
    return {
      status: 500,
      message: error.message
    };
  }

  return {
    status: 500,
    message: 'An unknown error occurred'
  };
}