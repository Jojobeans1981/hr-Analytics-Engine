const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployee,
  getEmployeeStats,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');

const aiRecommendationService = require('../../backend/backend/services/aiRecommendationService');
const Employee = require('../models/Employee');

// GET /api/employees
router.get('/', getEmployees);

// GET /api/employees/stats/summary
router.get('/stats/summary', getEmployeeStats);

// GET /api/employees/:id
router.get('/:id', getEmployee);

// POST /api/employees
router.post('/', createEmployee);

// PUT /api/employees/:id
router.put('/:id', updateEmployee);

// DELETE /api/employees/:id
router.delete('/:id', deleteEmployee);

// POST /api/employees/:id/generate-recommendations
router.post('/:id/generate-recommendations', async (req, res) => {
  try {
    // Try finding by MongoDB _id first, then by custom ID field
    let employee;
    try {
      employee = await Employee.findById(req.params.id);
    } catch (err) {
      // If not a valid ObjectId, try finding by employeeId or other field
      employee = await Employee.findOne({
        $or: [{ employeeId: req.params.id }, { email: req.params.id }],
      });
    }

    if (!employee) {
      // Last try: find by name or other identifier
      employee = await Employee.findOne({
        $or: [
          { _id: req.params.id },
          { employeeId: req.params.id },
          { email: req.params.id },
          { name: { $regex: req.params.id, $options: 'i' } },
        ],
      });
    }

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    if (employee.riskLevel !== 'HIGH') {
      return res.status(400).json({
        success: false,
        message: 'AI recommendations only for high-risk employees',
      });
    }

    const recommendations =
      await aiRecommendationService.generateRecommendations(employee);

    employee.aiRecommendations = recommendations;
    employee.recommendationGeneratedAt = new Date();
    await employee.save();

    res.json({
      success: true,
      message: 'AI recommendations generated',
      data: recommendations,
      employeeId: employee._id,
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations',
    });
  }
});

module.exports = router;
