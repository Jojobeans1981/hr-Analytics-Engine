const Employee = require('../models/Employee');
// Helper to map database fields to API response
function formatEmployeeResponse(employee) {
  return {
    _id: employee._id,
    employeeId: employee.employeeId,
    name: employee.name,
    department: employee.department,
    riskScore: employee.riskScore,
    riskLevel: employee.riskLevel.toUpperCase(), // Convert to uppercase for frontend
    email: employee.email,
    position: employee.role, // Map role to position
    role: employee.role,
    hireDate: employee.hireDate,
    lastReview: employee.lastAssessmentDate,
    performanceScore: employee.performanceRating ? (employee.performanceRating / 5) * 100 : 0,
    performanceRating: employee.performanceRating,
    location: employee.location,
    tenureMonths: employee.tenureMonths,
    engagementScore: employee.engagementScore,
    compRatio: employee.compRatio,
    criticalSkills: employee.criticalSkills || [],
    skillGaps: employee.skillGaps || [],
    status: employee.status,
    createdAt: employee.createdAt,
    updatedAt: employee.updatedAt
  };
}
// @desc    Get all employees
// @route   GET /api/employees
// @access  Public
exports.getEmployees = async (req, res) => {
  try {
    const { department, riskLevel, status = 'Active', sortBy = 'riskScore', order = 'desc' } = req.query;
    
    // Build query
    let query = {};
    if (department) query.department = department;
    if (riskLevel) query.riskLevel = riskLevel;
  // Build sort
    const sortOrder = order === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };
    
    const employees = await Employee.find(query).sort(sort);
    
    // Format response
    const formattedEmployees = employees.map(formatEmployeeResponse);
    
    res.status(200).json({
      success: true,
      count: formattedEmployees.length,
      data: formattedEmployees
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
      data: formatEmployeeResponse(employee)
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
    const totalEmployees = await Employee.countDocuments({ status: 'Active' });
    const highRiskCount = await Employee.countDocuments({ riskLevel: 'high', status: 'Active' });
    const mediumRiskCount = await Employee.countDocuments({ riskLevel: 'medium', status: 'Active' });
    const lowRiskCount = await Employee.countDocuments({ riskLevel: 'low', status: 'Active' });
    
    // Department breakdown
    const departmentStats = await Employee.aggregate([
      { $match: { status: 'Active' } },
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
      { $match: { status: 'Active' } },
      {
        $bucket: {
          groupBy: '$riskScore',
          boundaries: [0, 20, 40, 60, 80, 100],
          default: 'Other',
          output: {
            count: { $sum: 1 },
            avgTenure: { $avg: '$tenureMonths' },
            avgPerformance: { $avg: '$performanceRating' }
          }
        }
      }
    ]);
    
    // Top risk factors
    const employees = await Employee.find({ status: 'Active' });
    const avgCompRatio = employees.reduce((sum, emp) => sum + (emp.compRatio || 1), 0) / employees.length;
    const avgEngagement = employees.reduce((sum, emp) => sum + (emp.engagementScore || 0.5), 0) / employees.length;
    const avgTenure = employees.reduce((sum, emp) => sum + (emp.tenureMonths || 0), 0) / employees.length;
    
    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        riskLevels: {
          high: highRiskCount,
          medium: mediumRiskCount,
          low: lowRiskCount
        },
        departmentStats: departmentStats.map(dept => ({
          department: dept._id,
          count: dept.count,
          avgRiskScore: Math.round(dept.avgRiskScore || 0),
          maxRiskScore: Math.round(dept.maxRiskScore || 0),
          minRiskScore: Math.round(dept.minRiskScore || 0)
        })),
        riskDistribution: riskDistribution.map(bucket => ({
          range: `${bucket._id}-${bucket._id + 19}`,
          count: bucket.count,
          avgTenure: Math.round(bucket.avgTenure || 0),
          avgPerformance: Math.round((bucket.avgPerformance || 0) * 20) // Convert to 0-100
        })),
        averages: {
          avgRiskScore: Math.round(employees.reduce((sum, emp) => sum + emp.riskScore, 0) / employees.length),
          avgCompRatio: Math.round(avgCompRatio * 100) / 100,
          avgEngagement: Math.round(avgEngagement * 100),
          avgTenure: Math.round(avgTenure)
        }
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
    // Map API fields to database fields
    const employeeData = {
      name: req.body.name,
      email: req.body.email,
      employeeId: req.body.employeeId || `EMP${Date.now().toString().slice(-6)}`,
      department: req.body.department,
      role: req.body.position || req.body.role,
      location: req.body.location,
      tenureMonths: req.body.tenureMonths || 0,
      performanceRating: req.body.performanceRating || req.body.performanceScore ? req.body.performanceScore / 20 : 2.5,
      engagementScore: req.body.engagementScore || 0.5,
      compRatio: req.body.compRatio || 1.0,
      criticalSkills: req.body.criticalSkills || [],
      skillGaps: req.body.skillGaps || [],
      riskScore: req.body.riskScore || 50,
      riskLevel: (req.body.riskLevel || 'medium').toLowerCase(),
      status: req.body.status || 'Active',
      hireDate: req.body.hireDate || new Date()
    };
    
    const employee = await Employee.create(employeeData);
    
    res.status(201).json({
      success: true,
      data: formatEmployeeResponse(employee)
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
      data: formatEmployeeResponse(employee)
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