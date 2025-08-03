import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import assessmentRoutes from './assessment.routes';
import employeeRoutes from './employees.route';
import teamRoutes from './team.routes';
import authRoutes from './auth.routes';
import docsRoutes from './docs.routes';

const router = Router();

router.use('/assessments', assessmentRoutes);
router.use('/employees', employeeRoutes);
router.use('/teams', teamRoutes);
router.use('/auth', authRoutes);

export default router;
