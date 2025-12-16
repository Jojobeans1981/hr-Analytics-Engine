const Employee = require('../models/Employee');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Public
exports.getEmployees = async (req, res) => {
  try {
    const { department, riskLevel, sortBy = 'name', order = 'asc' } = req.query;
    
    // Build query
    let query = {};
    if (department) query.department = department;
    if (riskLevel) query.riskLevel = riskLevel.toUpperCase();
    
    // Build sort
    const sortOrder = order === 'desc' ? -1 : 1;
    const sort = { [sortBy]: sortOrder };
    
    const employees = await Employee.find(query).sort(sort);
    
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Public
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get employee statistics
// @route   GET /api/employees/stats/summary
// @access  Public
exports.getEmployeeStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const highRiskCount = await Employee.countDocuments({ riskLevel: 'HIGH' });
    const mediumRiskCount = await Employee.countDocuments({ riskLevel: 'MEDIUM' });
    const lowRiskCount = await Employee.countDocuments({ riskLevel: 'LOW' });
    
    // Department breakdown
    const departmentStats = await Employee.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          avgRiskScore: { $avg: '$riskScore' },
          maxRiskScore: { $max: '$riskScore' },
          minRiskScore: { $min: '$riskScore' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Risk score distribution
    const riskDistribution = await Employee.aggregate([
      {
        $bucket: {
          groupBy: '$riskScore',
          boundaries: [0, 20, 40, 60, 80, 100],
          default: 'Other',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        riskLevels: {
          high: highRiskCount,
          medium: mediumRiskCount,
          low: lowRiskCount
        },
        departments: departmentStats,
        riskDistribution
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Public
exports.createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    
    res.status(201).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Public
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Public
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
