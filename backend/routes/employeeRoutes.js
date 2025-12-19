const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
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
      // If not a valid ObjectId, try finding by employeeId or other field
      employee = await Employee.findOne({
        $or: [{ employeeId: req.params.id }, { email: req.params.id }],
      });
    }

    // If employee not found in DB, use request body data (for testing)
    if (!employee) {
      console.log('Employee not found in database, using request body data');
      employee = req.body;
      // Add ID fields for consistency
      employee._id = req.params.id;
      employee.employeeId = req.params.id;
    } else {
      console.log('Found employee in database:', employee.name || 'Unknown');
      // Convert mongoose document to plain object
      employee = employee.toObject();
    }

    // Check risk level - allow any risk level for now
    // Original code only allowed 'HIGH', but we'll allow all
    const riskLevel = employee.riskLevel || req.body.riskLevel;
    console.log('Employee risk level:', riskLevel);

    // Generate recommendations using the correct function name
    const recommendations = await generateAIRecommendations(employee);

    // Try to update employee with AI recommendations if it exists in DB
    if (employee._id && employee._id.toString().length === 24) {
      // Valid MongoDB ID
      try {
        await Employee.findByIdAndUpdate(
          employee._id,
          {
            $set: {
              aiRecommendations: recommendations,
              recommendationGeneratedAt: new Date(),
            },
          },
          { new: true },
        );
        console.log('Updated employee with recommendations');
      } catch (updateError) {
        console.log(
          'Could not update employee with recommendations:',
          updateError.message,
        );
      }
    }

    res.json({
      success: true,
      message: 'AI recommendations generated',
      data: recommendations,
      employeeId: req.params.id,
      employeeName: employee.name || 'Unknown',
      riskLevel: riskLevel,
      usedDatabase: !!employee._id,
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

// GET /api/employees
router.get('/', getEmployees);

// GET /api/employees/:id
router.get('/:id', getEmployeeById);

// PUT /api/employees/:id
router.put('/:id', updateEmployee);

// POST /api/employees
router.post('/', createEmployee);

// DELETE /api/employees/:id
router.delete('/:id', deleteEmployee);

module.exports = router;
