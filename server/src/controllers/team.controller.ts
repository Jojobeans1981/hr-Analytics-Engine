import { Request, Response } from 'express';
import { TeamService } from '../services/team.service';
import { ObjectId } from 'mongodb';

export class TeamController {
  static async createTeam(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, managerId, memberIds, department } = req.body;

      if (!name?.trim()) {
        res.status(400).json({
          success: false,
          error: 'Team name is required'
        });
        return;
      }

      // Create complete team data with ALL required properties
      const teamData = {
        name: name.trim(),
        description: description || '',
        managerId: managerId,
        memberIds: memberIds || [],
        department: department || 'General',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const team = await TeamService.createTeam(teamData);
      
      res.status(201).json({
        success: true,
        data: team
      });
    } catch (error: any) {
      console.error('Create team error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create team'
      });
    }
  }

  static async getTeam(req: Request, res: Response): Promise<void> {
    try {
      const teamId = req.params.id;

      if (!ObjectId.isValid(teamId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid team ID format'
        });
        return;
      }

      const team = await TeamService.getTeamById(new ObjectId(teamId));

      if (!team) {
        res.status(404).json({
          success: false,
          error: 'Team not found'
        });
        return;
      }

      res.json({
        success: true,
        data: team
      });
    } catch (error: any) {
      console.error('Get team error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get team'
      });
    }
  }

  static async updateTeam(req: Request, res: Response): Promise<void> {
    try {
      const teamId = req.params.id;
      const updateData = {
        ...req.body,
        updatedAt: new Date()
      };

      if (!ObjectId.isValid(teamId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid team ID format'
        });
        return;
      }

      const team = await TeamService.updateTeam(new ObjectId(teamId), updateData);

      if (!team) {
        res.status(404).json({
          success: false,
          error: 'Team not found'
        });
        return;
      }

      res.json({
        success: true,
        data: team
      });
    } catch (error: any) {
      console.error('Update team error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update team'
      });
    }
  }

  static async deleteTeam(req: Request, res: Response): Promise<void> {
    try {
      const teamId = req.params.id;

      if (!ObjectId.isValid(teamId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid team ID format'
        });
        return;
      }

      // Remove the truthiness check since deleteTeam returns void
      await TeamService.deleteTeam(new ObjectId(teamId));

      res.json({
        success: true,
        message: 'Team deleted successfully'
      });
    } catch (error: any) {
      console.error('Delete team error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete team'
      });
    }
  }

  static async getAllTeams(req: Request, res: Response): Promise<void> {
    try {
      // Use getTeams instead of getAllTeams
      const teams = await (TeamService as any).getTeams();
      
      res.json({
        success: true,
        data: teams,
        count: teams?.length || 0
      });
    } catch (error: any) {
      console.error('Get all teams error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get teams'
      });
    }
  }

  static async getTeamRisk(req: Request, res: Response): Promise<void> {
    try {
      const teamId = req.params.id;

      if (!ObjectId.isValid(teamId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid team ID format'
        });
        return;
      }

      const team = await TeamService.getTeamById(new ObjectId(teamId));

      if (!team) {
        res.status(404).json({
          success: false,
          error: 'Team not found'
        });
        return;
      }

      // Simple risk calculation
      const teamData = team as any;
      const avgRiskScore = teamData.riskScore || teamData.avgRiskScore || 25;
      const riskLevel = avgRiskScore > 70 ? 'high' : avgRiskScore > 40 ? 'medium' : 'low';

      res.json({
        success: true,
        data: {
          riskScore: avgRiskScore,
          riskLevel: riskLevel
        }
      });
    } catch (error: any) {
      console.error('Get team risk error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get team risk assessment'
      });
    }
  }
}