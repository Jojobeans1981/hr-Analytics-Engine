import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';

// Import your centralized CORS configuration
import { corsOptions } from './middleware/security.middleware.js';

// Routes (adjust based on your structure)
import apiRouter from "./routes/index.js"

const app = express();

// Middleware - USE ONLY ONE CORS CONFIGURATION
app.use(helmet());
app.use(cors(corsOptions));  // Use your security middleware CORS config
app.use(compression());
app.use(morgan('combined'));

// Remove any other CORS configurations from this file!
// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Static files
app.use(express.static(path.join(process.cwd(), 'public')));

// Routes
app.use('/api', apiRouter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
