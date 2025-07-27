const Team = require('../models/Team');
const Employee = require('../models/Employee');
const logger = require('../config/logger');

exports.getAllTeams = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = 'name'
    } = req.query;

    const teams = await Team.find()
      .populate('manager', 'name email')
      .populate('members', 'name role currentRiskLevel')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Team.countDocuments();

    res.status(200).json({
      success: true,
      count: teams.length,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: page,
      data: teams
    });
  } catch (error) {
    next(error);
  }
};

exports.getTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('manager')
      .populate({
        path: 'members',
        populate: { path: 'skills' }
      });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.status(200).json({
      success: true,
      data: team
    });
  } catch (error) {
    next(error);
  }
};

exports.createTeam = async (req, res, next) => {
  try {
    const team = await Team.create({
      ...req.body,
      createdBy: req.user?.id
    });

    logger.info(`New team created: ${team.name}`);

    res.status(201).json({
      success: true,
      data: team
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTeam = async (req, res, next) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.status(200).json({
      success: true,
      data: team
    });
  } catch (error) {
    next(error);
  }
};

exports.addMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { employeeId } = req.body;

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Check if already a member
    if (team.members.includes(employeeId)) {
      return res.status(400).json({ error: 'Employee is already a team member' });
    }

    team.members.push(employeeId);
    await team.save();

    // Update employee's team reference
    employee.team = id;
    await employee.save();

    res.status(200).json({
      success: true,
      message: 'Team member added successfully',
      data: team
    });
  } catch (error) {
    next(error);
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    const { id, memberId } = req.params;

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    team.members = team.members.filter(m => m.toString() !== memberId);
    await team.save();

    // Remove team reference from employee
    await Employee.findByIdAndUpdate(memberId, { $unset: { team: 1 } });

    res.status(200).json({
      success: true,
      message: 'Team member removed successfully',
      data: team
    });
  } catch (error) {
    next(error);
  }
};