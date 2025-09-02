import express from 'express';
import sentimentRoutes from '@/routes/sentiment.routes.js';
import skillsRoutes from '@/routes/skills.routes.js';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import apiRouter from '@/routes/index.js';
import { errorHandler } from '@/middleware/errorHandler.middleware.js';
import { corsOptions } from '../server/src/middleware/security.middleware.js';
import connectDB from '../server/src/db/connect.js';

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', apiRouter);
app.use('/api/sentiment', sentimentRoutes);
app.use('/api/skills', skillsRoutes);

// Error handling
app.use(errorHandler);

// Database connection
connectDB();

export default app;