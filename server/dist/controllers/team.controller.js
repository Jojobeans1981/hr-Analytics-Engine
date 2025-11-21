"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamController = void 0;
const team_service_1 = require("../services/team.service");
const mongodb_1 = require("mongodb");
class TeamController {
    static async createTeam(req, res) {
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
            const team = await team_service_1.TeamService.createTeam(teamData);
            res.status(201).json({
                success: true,
                data: team
            });
        }
        catch (error) {
            console.error('Create team error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to create team'
            });
        }
    }
    static async getTeam(req, res) {
        try {
            const teamId = req.params.id;
            if (!mongodb_1.ObjectId.isValid(teamId)) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid team ID format'
                });
                return;
            }
            const team = await team_service_1.TeamService.getTeamById(new mongodb_1.ObjectId(teamId));
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
        }
        catch (error) {
            console.error('Get team error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get team'
            });
        }
    }
    static async updateTeam(req, res) {
        try {
            const teamId = req.params.id;
            const updateData = {
                ...req.body,
                updatedAt: new Date()
            };
            if (!mongodb_1.ObjectId.isValid(teamId)) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid team ID format'
                });
                return;
            }
            const team = await team_service_1.TeamService.updateTeam(new mongodb_1.ObjectId(teamId), updateData);
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
        }
        catch (error) {
            console.error('Update team error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update team'
            });
        }
    }
    static async deleteTeam(req, res) {
        try {
            const teamId = req.params.id;
            if (!mongodb_1.ObjectId.isValid(teamId)) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid team ID format'
                });
                return;
            }
            // Remove the truthiness check since deleteTeam returns void
            await team_service_1.TeamService.deleteTeam(new mongodb_1.ObjectId(teamId));
            res.json({
                success: true,
                message: 'Team deleted successfully'
            });
        }
        catch (error) {
            console.error('Delete team error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to delete team'
            });
        }
    }
    static async getAllTeams(req, res) {
        try {
            // Use getTeams instead of getAllTeams
            const teams = await team_service_1.TeamService.getTeams();
            res.json({
                success: true,
                data: teams,
                count: teams?.length || 0
            });
        }
        catch (error) {
            console.error('Get all teams error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get teams'
            });
        }
    }
    static async getTeamRisk(req, res) {
        try {
            const teamId = req.params.id;
            if (!mongodb_1.ObjectId.isValid(teamId)) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid team ID format'
                });
                return;
            }
            const team = await team_service_1.TeamService.getTeamById(new mongodb_1.ObjectId(teamId));
            if (!team) {
                res.status(404).json({
                    success: false,
                    error: 'Team not found'
                });
                return;
            }
            // Simple risk calculation
            const teamData = team;
            const avgRiskScore = teamData.riskScore || teamData.avgRiskScore || 25;
            const riskLevel = avgRiskScore > 70 ? 'high' : avgRiskScore > 40 ? 'medium' : 'low';
            res.json({
                success: true,
                data: {
                    riskScore: avgRiskScore,
                    riskLevel: riskLevel
                }
            });
        }
        catch (error) {
            console.error('Get team risk error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get team risk assessment'
            });
        }
    }
}
exports.TeamController = TeamController;
