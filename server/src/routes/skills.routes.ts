// skills.routes.ts
import { Router } from 'express';
import skillsController from '../controllers/skills.controller';

const router = Router();

router.post('/analyze', skillsController.analyzeText);

export default router;