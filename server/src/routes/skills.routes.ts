import { Router } from 'express';
import { SkillsController } from '../controllers/skills.controller';

const router = Router();

router.post('/extract', SkillsController.extractSkills);
router.get('/teams/:teamId', SkillsController.analyzeTeamSkills);

export default router;
