import * as winston from 'winston'
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

export const createLogger = (serviceName: string) => ({
  info: (message: string, meta?: any) => 
    logger.info(`[${serviceName}] ${message}`, meta),
  error: (message: string, error?: any) => 
    logger.error(`[${serviceName}] ${message}`, error),
  debug: (message: string, meta?: any) => 
    logger.debug(`[${serviceName}] ${message}`, meta),
  success: (message: string) => 
    logger.info(`[${serviceName}] ✅ ${message}`)
});

export default logger;