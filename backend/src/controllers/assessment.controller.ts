import { Request, Response, NextFunction } from 'express';
import RiskPredictorService from '../services/risk-predictor.service';
import Assessment from '../models/assessment.model';
import { Employee } from '../models/employee.model';
import Team from '../models/team.model';
import logger from '../config/logger';

const talentRiskAssessor = new RiskPredictorService();

export const assessEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.params;
    
    // Find employee
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Perform risk assessment
    const riskAssessment = await talentRiskAssessor.assessEmployee(employee);

    // Save assessment to history
    const assessment = new Assessment({
      employee: employeeId,
      type: 'individual',
      riskScore: riskAssessment.riskScore,
      riskLevel: riskAssessment.riskLevel,
      factors: riskAssessment.factors,
      recommendations: riskAssessment.recommendations,
      assessedBy: 'system', // In production, use req.user.id
      assessmentDate: new Date()
    });

    await assessment.save();

    // Update employee with latest assessment
    (employee as any).latestAssessment = assessment._id;
    employee.riskScore = riskAssessment.riskScore;
    employee.riskLevel = riskAssessment.riskLevel;
    await employee.save();

    return res.json({
      success: true,
      data: riskAssessment,
      assessmentId: assessment._id
    });
  } catch (error) {
    logger.error('Employee assessment error:', error);
    return next(error);
  }
};

export const assessTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teamId } = req.params;
    
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const teamAssessment = await talentRiskAssessor.assessTeam(team);

    // Save team assessment
    const assessment = new Assessment({
      team: teamId,
      type: 'team',
      riskScore: teamAssessment.teamRiskScore,
      riskLevel: teamAssessment.teamRiskLevel,
      members: team.memberIds.map((memberId: any) => ({
        employee: memberId,
        riskScore: (teamAssessment.memberScores as Record<string, any>)[memberId as string]?.riskScore || 0,
        riskLevel: (teamAssessment.memberScores as Record<string, any>)[memberId as string]?.riskLevel || 'low'
      })),
      assessedBy: 'system',
      assessmentDate: new Date()
    });

    await assessment.save();

    // Update team with latest assessment
    (team as any).latestAssessment = assessment._id;
    await team.save();

    res.json({
      success: true,
      data: teamAssessment,
      assessmentId: assessment._id
    });
  } catch (error) {
    logger.error('Team assessment error:', error);
    return next(error);
  }
};

export const getEmployeeHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.params;
    
    const assessments = await Assessment.find({ employee: employeeId })
      .sort({ assessmentDate: -1 })
      .limit(20);

    res.json({
      success: true,
      data: assessments
    });
  } catch (error) {
    logger.error('Get assessment history error:', error);
    return next(error);
  }
};

export const getLatestTeamAssessment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teamId } = req.params;
    
    const assessment = await Assessment.findOne({ team: teamId })
      .sort({ assessmentDate: -1 });

    if (!assessment) {
      return res.status(404).json({ error: 'No assessment found for team' });
    }

    res.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    logger.error('Get team assessment error:', error);
    return next(error);
  }
};

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalAssessments = await Assessment.countDocuments();
    const recentAssessments = await Assessment.find()
      .sort({ assessmentDate: -1 })
      .limit(10)
      .populate('employee', 'name department')
      .populate('team', 'name');

    const highRiskCount = await Assessment.countDocuments({ riskLevel: 'high' });
    const mediumRiskCount = await Assessment.countDocuments({ riskLevel: 'medium' });

    res.json({
      success: true,
      data: {
        totalAssessments,
        recentAssessments,
        highRiskCount,
        mediumRiskCount,
        riskDistribution: {
          high: highRiskCount,
          medium: mediumRiskCount,
          low: totalAssessments - highRiskCount - mediumRiskCount
        }
      }
    });
  } catch (error) {
    logger.error('Get dashboard stats error:', error);
    return next(error);
  }
};
