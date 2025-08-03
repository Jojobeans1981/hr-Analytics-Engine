import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { TeamService } from '../services/team.service';
import { validateRequest } from '../middleware/validation.middleware';
import { teamQuerySchema, teamCreateSchema } from '../validations/team.validation';

const router = Router();

// GET all teams
router.get(
  '/',
  validateRequest(teamQuerySchema),
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const teams = await TeamService.getTeams(req.query);
      res.json({
        success: true,
        count: teams.length,
        data: teams
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch teams'
      });
    }
  })
);

// GET single team
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const team = await TeamService.getTeamById(new ObjectId(req.params.id));
      if (!team) {
        res.status(404).json({ success: false, message: 'Team not found' });
        return;
      }
      res.json({ success: true, data: team });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Invalid team ID'
      });
    }
  })
);

// POST create team
router.post(
  '/',
  validateRequest(teamCreateSchema),
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const team = await TeamService.createTeam(req.body);
      res.status(201).json({ success: true, data: team });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Team creation failed'
      });
    }
  })
);

// PUT update team
router.put(
  '/:id',
  validateRequest(teamCreateSchema),
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const team = await TeamService.updateTeam(
        new ObjectId(req.params.id),
        req.body
      );
      res.json({ success: true, data: team });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Team update failed'
      });
    }
  })
);

// DELETE team
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      await TeamService.deleteTeam(new ObjectId(req.params.id));
      res.json({ success: true, message: 'Team deleted successfully' });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Team deletion failed'
      });
    }
  })
);

export default router;