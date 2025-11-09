import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import assessmentRoutes from '../routes/assessment.routes.js';
import employeeRoutes from '../routes/employees.route.js';
import teamRoutes from '../routes/team.routes.js';
import authRoutes from '../routes/auth.routes.js';
import docsRoutes from '../routes/docs.routes.js';

const router = Router();

router.use('/assessments', assessmentRoutes);
router.use('/employees', employeeRoutes);
router.use('/teams', teamRoutes);
router.use('/auth', authRoutes);

export default router;
