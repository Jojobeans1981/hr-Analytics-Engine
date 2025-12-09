import { Router } from 'express';
import { TeamController } from '../controllers/team.controller';

const router = Router();

router.post('/', TeamController.createTeam);
router.get('/', TeamController.getAllTeams);
router.get('/:id', TeamController.getTeam);
router.put('/:id', TeamController.updateTeam);
router.delete('/:id', TeamController.deleteTeam);
router.get('/:id/risk', TeamController.getTeamRisk);

export default router;
