import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import assessmentRoutes from './assessment.routes';
import employeeRoutes from './employees.route'; // Updated import
import teamRoutes from './team.routes';
import authRoutes from './auth.routes';
import riskRoutes from './risk.routes';

const router = Router();

router.use('/assessments', assessmentRoutes);
router.use('/employees', employeeRoutes);
router.use('/teams', teamRoutes);
router.use('/auth', authRoutes);
router.use('/risk', riskRoutes); 

export default router;