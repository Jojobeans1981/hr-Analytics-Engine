import express from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticate);

router.get('/',
  DashboardController.getDashboardData
);

router.get('/risk-trends',
  DashboardController.getRiskTrends
);

export default router;