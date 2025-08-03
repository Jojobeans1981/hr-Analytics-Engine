javascript
const TalentRiskAssessor = require('./services/TalentRiskAssessor');
const Assessment = require('./models/Assessment');
const Employee = require('./models/Employee');
const Team = require('./models/Team');
const logger = require('../config/logger');

const talentRiskAssessor = new TalentRiskAssessor();

exports.assessEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    
    // Fetch employee data
    const employee = await Employee.findById(employeeId)
      .populate('skills')
      .populate('team');
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Prepare data for assessment
    const employeeData = {
      id: employee._id,
      name: employee.name,
      role: employee.role,
      department: employee.department,
      isManager: employee.isManager,
      yearsExperience: employee.yearsExperience,
      performanceScores: employee.performanceScores,
      feedbackHistory: employee.feedbackHistory,
      skills: employee.skills,
      criticalProject: employee.criticalProject,
      clientFacing: employee.clientFacing
    };

    // Run assessment
    const assessment = await talentRiskAssessor.assessEmployee(employeeData);

    // Save assessment to database
    const savedAssessment = await Assessment.create({
      ...assessment,
      employee: employeeId,
      assessedBy: req.user?.id
    });

    // Update employee's last assessment date
    employee.lastAssessment = new Date();
    employee.currentRiskLevel = assessment.risk.level;
    await employee.save();

    logger.info(`Assessment completed for employee ${employeeId}`);
    
    res.status(200).json({
      success: true,
      data: savedAssessment
    });
  } catch (error) {
    next(error);
  }
};

exports.assessTeam = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    
    // Fetch team with members
    const team = await Team.findById(teamId)
      .populate({
        path: 'members',
        populate: { path: 'skills' }
      });
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Prepare team data
    const teamData = {
      id: team._id,
      name: team.name,
      members: team.members.map(member => ({
        id: member._id,
        name: member.name,
        role: member.role,
        department: member.department,
        isManager: member.isManager,
        yearsExperience: member.yearsExperience,
        performanceScores: member.performanceScores,
        feedbackHistory: member.feedbackHistory,
        skills: member.skills,
        criticalProject: member.criticalProject,
        clientFacing: member.clientFacing
      }))
    };

    // Run team assessment
    const assessment = await talentRiskAssessor.assessTeam(teamData);

    // Save team assessment
    const savedAssessment = await Assessment.create({
      ...assessment,
      team: teamId,
      type: 'team',
      assessedBy: req.user?.id
    });

    logger.info(`Team assessment completed for team ${teamId}`);
    
    res.status(200).json({
      success: true,
      data: savedAssessment
    });
  } catch (error) {
    next(error);
  }
};

exports.getEmployeeHistory = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { limit = 10, sort = '-assessmentDate' } = req.query;

    const assessments = await Assessment.find({ 
      employee: employeeId,
      type: { $ne: 'team' }
    })
    .sort(sort)
    .limit(parseInt(limit))
    .populate('assessedBy', 'name email');

    res.status(200).json({
      success: true,
      count: assessments.length,
      data: assessments
    });
  } catch (error) {
    next(error);
  }
};

exports.getLatestTeamAssessment = async (req, res, next) => {
  try {
    const { teamId } = req.params;

    const assessment = await Assessment.findOne({ 
      team: teamId,
      type: 'team'
    })
    .sort('-assessmentDate')
    .populate('assessedBy', 'name email');

    if (!assessment) {
      return res.status(404).json({ error: 'No assessments found for this team' });
    }

    res.status(200).json({
      success: true,
      data: assessment
    });
  } catch (error) {
    next(error);
  }
};

// Dashboard endpoint
exports.getDashboardStats = async (req, res, next) => {
  try {
    const stats = await Assessment.aggregate([
      {
        $match: {
          assessmentDate: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      },
      {
        $group: {
          _id: null,
          totalAssessments: { $sum: 1 },
          avgRiskScore: { $avg: '$risk.score' },
          highRiskCount: {
            $sum: { $cond: [{ $eq: ['$risk.level', 'high'] }, 1, 0] }
          },
          mediumRiskCount: {
            $sum: { $cond: [{ $eq: ['$risk.level', 'medium'] }, 1, 0] }
          },
          lowRiskCount: {
            $sum: { $cond: [{ $eq: ['$risk.level', 'low'] }, 1, 0] }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || {
        totalAssessments: 0,
        avgRiskScore: 0,
        highRiskCount: 0,
        mediumRiskCount: 0,
        lowRiskCount: 0
      }
    });
  } catch (error) {
    next(error);
  }
};