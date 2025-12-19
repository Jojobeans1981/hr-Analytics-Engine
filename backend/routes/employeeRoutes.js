const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployee, // Note: controller has getEmployee, not getEmployeeById
  updateEmployee,
  createEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');

const {
  generateAIRecommendations,
} = require('../services/aiRecommendationService');
const Employee = require('../models/Employee');

// POST /api/employees/:id/generate-recommendations
router.post('/:id/generate-recommendations', async (req, res) => {
  try {
    console.log('Generating recommendations for ID:', req.params.id);

    // Try finding by MongoDB _id first, then by custom ID field
    let employee;
    try {
      employee = await Employee.findById(req.params.id);
    } catch (err) {
      console.log('Not a valid ObjectId, trying employeeId or email...');
      employee = await Employee.findOne({
        $or: [{ employeeId: req.params.id }, { email: req.params.id }],
      });
    }

    // If employee not found in DB, use request body data
    if (!employee) {
      console.log('Employee not found in database, using request body data');
      employee = req.body;
      employee._id = req.params.id;
      employee.employeeId = req.params.id;
    } else {
      console.log('Found employee in database:', employee.name || 'Unknown');
      employee = employee.toObject();
    }

    console.log('Employee data:', {
      name: employee.name,
      department: employee.department,
      riskLevel: employee.riskLevel,
    });

    // Generate recommendations
    const recommendations = await generateAIRecommendations(employee);

    // Return response
    res.json({
      success: true,
      message: 'AI recommendations generated',
      data: recommendations,
      employeeId: req.params.id,
      employeeName: employee.name || 'Unknown',
      riskLevel: employee.riskLevel || 'Not specified',
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations',
      error: error.message,
    });
  }
});

// GET /api/employees
router.get('/', getEmployees);

// GET /api/employees/:id - using getEmployee (not getEmployeeById)
router.get('/:id', getEmployee);

// PUT /api/employees/:id
router.put('/:id', updateEmployee);

// POST /api/employees
router.post('/', createEmployee);

// DELETE /api/employees/:id
router.delete('/:id', deleteEmployee);

module.exports = router;
