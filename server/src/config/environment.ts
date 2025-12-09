// src/config/environment.ts
import dotenv from 'dotenv';

dotenv.config();

export const environment = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  frontendUrl: process.env.FRONTEND_URL,
  // Add other environment variables as needed
};