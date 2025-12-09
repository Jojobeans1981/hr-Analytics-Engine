import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

// Basic documentation route
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    title: 'Talent Risk Assessment API',
    version: '1.0.0',
    description: 'API for assessing employee flight risk and team health',
    endpoints: {
      base: process.env.API_URL || 'http://localhost:3000',
      docs: '/api/docs',
      health: '/health',
      assessments: '/api/assessments',
      employees: '/api/employees',
      teams: '/api/teams',
      auth: '/api/auth'
    },
    documentation: 'https://github.com/your-repo/docs'
  });
});

export default router;