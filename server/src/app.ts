import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// CORS configuration that handles multiple origins and headers
const corsOptions = {
  origin: (origin: string | undefined, callback: any) => {
    const allowedOrigins = process.env.CLIENT_URL?.split(',') || [
      'http://localhost:3000',
      'https://dashboard-new-eta-blond.vercel.app',
      'https://dashboard-gfjo6f4rg-joseph-panettas-projects.vercel.app'
    ];
    
    // Allow requests with no origin
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
    'Cache-Control',
    'Pragma',
    'If-Modified-Since',
    'If-None-Match'
  ],
  exposedHeaders: [
    'Content-Range',
    'X-Content-Range',
    'Content-Length',
    'ETag'
  ],
  optionsSuccessStatus: 200
};

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

// Handle preflight requests
app.options('*', cors(corsOptions));

// Basic health check route
app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
