import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';

const router = Router();

router.get('/', DashboardController.getDashboardData);
router.get('/teams/:teamId/metrics', DashboardController.getTeamMetrics);

export default router;
