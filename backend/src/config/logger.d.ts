declare module '../config/logger' {
  import winston from 'winston';
  const logger: winston.Logger;
  export default logger;
}