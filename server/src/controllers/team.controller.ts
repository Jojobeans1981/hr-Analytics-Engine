import { Request, Response } from 'express';
import { TeamService } from '../server/src/services/team.service';
import { 
  TeamCreateDto,
  TeamUpdateDto
} from '../dtos/team.dto';
import { validateRequest } from '../middleware/validation.middleware';
import { ApiResponse } from '../utils/apiResponse';

export class TeamController {
  static async createTeam(req: Request, res: Response) {
    try {
      const team = await TeamService.create(req.body as TeamCreateDto);
      new ApiResponse(team, 201).send(res);
    } catch (error) {
      ApiResponse.handleError(error, res);
    }
  }

  static async getTeam(req: Request, res: Response) {
    try {
      const team = await TeamService.getById(req.params.id);
      new ApiResponse(team).send(res);
    } catch (error) {
      ApiResponse.handleError(error, res);
    }
  }

  static async updateTeam(req: Request, res: Response) {
    try {
      const team = await TeamService.update(
        req.params.id,
        req.body as TeamUpdateDto
      );
      new ApiResponse(team).send(res);
    } catch (error) {
      ApiResponse.handleError(error, res);
    }
  }

  static async getTeamRisk(req: Request, res: Response) {
    try {
      const team = await TeamService.getById(req.params.id);
      new ApiResponse({
        riskScore: team.avgRiskScore,
        riskLevel: team.avgRiskScore ? 
          (team.avgRiskScore > 70 ? 'high' : 
           team.avgRiskScore > 40 ? 'medium' : 'low') : 'unknown'
      }).send(res);
    } catch (error) {
      ApiResponse.handleError(error, res);
    }
  }
}