const Employee = require('../models/Employee');
const logger = require('../config/logger');

exports.getAllEmployees = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = 'name',
      department,
      riskLevel 
    } = req.query;

    const query = {};
    if (department) query.department = department;
    if (riskLevel) query.currentRiskLevel = riskLevel;

    const employees = await Employee.find(query)
      .populate('skills')
      .populate('team')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Employee.countDocuments(query);

    res.status(200).json({
      success: true,
      count: employees.length,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: page,
      data: employees
    });
  } catch (error) {
    next(error);
  }
};

exports.getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('skills')
      .populate('team')
      .populate('manager');

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

exports.createEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.create({
      ...req.body,
      createdBy: req.user?.id
    });

    logger.info(`New employee created: ${employee.name}`);

    res.status(201).json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    logger.info(`Employee deleted: ${employee.name}`);

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.addFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { feedback, sentiment, date } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    employee.feedbackHistory.push({
      feedback,
      sentiment: sentiment || 0,
      date: date || new Date(),
      addedBy: req.user?.id
    });

    await employee.save();

    res.status(200).json({
      success: true,
      message: 'Feedback added successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePerformance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { scores } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Add new scores to the array
    employee.performanceScores.push(...scores);
    
    // Keep only the last 12 scores
    if (employee.performanceScores.length > 12) {
      employee.performanceScores = employee.performanceScores.slice(-12);
    }

    await employee.save();

    res.status(200).json({
      success: true,
      message: 'Performance scores updated',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};