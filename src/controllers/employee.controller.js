const Employee = require('../models/Employee');
const logger = require('../config/logger');
const { NotFoundError, BadRequestError } = require('../errors'); // Custom error classes

// Helper for pagination metadata
const getPaginationMeta = (data, count, page, limit) => ({
  success: true,
  count: data.length,
  total: count,
  totalPages: Math.ceil(count / limit),
  currentPage: Number(page),
  data
});

exports.getAllEmployees = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = 'name',
      department,
      riskLevel,
      search
    } = req.query;

    // Build query
    const query = {};
    if (department) query.department = department;
    if (riskLevel) query.currentRiskLevel = riskLevel;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Validate pagination inputs
    const validatedLimit = Math.min(Number(limit), 100);
    const validatedPage = Math.max(Number(page), 1);

    const [employees, count] = await Promise.all([
      Employee.find(query)
        .populate('skills team', 'name level') // Only select needed fields
        .sort(sort)
        .limit(validatedLimit)
        .skip((validatedPage - 1) * validatedLimit)
        .lean(), // Convert to plain JS objects
      Employee.countDocuments(query)
    ]);

    res.status(200).json(getPaginationMeta(employees, count, validatedPage, validatedLimit));
  } catch (error) {
    next(error);
  }
};

exports.getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('skills team manager', 'name email position')
      .lean();

    if (!employee) {
      throw new NotFoundError('Employee not found');
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
    // Validate required fields
    if (!req.body.name || !req.body.email) {
      throw new BadRequestError('Name and email are required');
    }

    const employee = await Employee.create({
      ...req.body,
      createdBy: req.user?.id
    });

    logger.info(`New employee created`, { 
      employeeId: employee._id,
      actionBy: req.user?.id 
    });

    res.status(201).json({
      success: true,
      data: employee.toObject() // Convert Mongoose doc to plain object
    });
  } catch (error) {
    if (error.code === 11000) { // MongoDB duplicate key error
      next(new BadRequestError('Email already exists'));
    } else {
      next(error);
    }
  }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'department', 'position'];
    const isValidOperation = updates.every(update => 
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      throw new BadRequestError('Invalid updates!');
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).lean();

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    logger.info(`Employee updated`, { 
      employeeId: employee._id,
      actionBy: req.user?.id 
    });

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
    const employee = await Employee.findByIdAndDelete(req.params.id).lean();

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    logger.info(`Employee deleted`, { 
      employeeId: employee._id,
      actionBy: req.user?.id 
    });

    res.status(200).json({ 
      success: true,
      data: employee 
    });
  } catch (error) {
    next(error);
  }
};