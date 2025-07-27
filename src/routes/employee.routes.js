const express = require('express');
const router = express.Router();
const mockEmployees = require('../data/mockEmployees');

// GET all employees
router.get('/', (req, res) => {
  // Support query parameters for filtering
  const { department, status, minRisk, maxRisk } = req.query;
  
  let filteredEmployees = [...mockEmployees];
  
  if (department) {
    filteredEmployees = filteredEmployees.filter(emp => 
      emp.department.toLowerCase() === department.toLowerCase()
    );
  }
  
  if (status) {
    filteredEmployees = filteredEmployees.filter(emp => 
      emp.status === status
    );
  }
  
  if (minRisk) {
    filteredEmployees = filteredEmployees.filter(emp => 
      emp.riskScore >= parseFloat(minRisk)
    );
  }
  
  if (maxRisk) {
    filteredEmployees = filteredEmployees.filter(emp => 
      emp.riskScore <= parseFloat(maxRisk)
    );
  }
  
  res.json({
    success: true,
    count: filteredEmployees.length,
    data: filteredEmployees
  });
});

// GET employee by ID
router.get('/:id', (req, res) => {
  const employee = mockEmployees.find(emp => emp.id === req.params.id);
  
  if (!employee) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found'
    });
  }
  
  res.json({
    success: true,
    data: employee
  });
});

// POST create new employee
router.post('/', (req, res) => {
  const newEmployee = {
    id: `emp${String(mockEmployees.length + 1).padStart(3, '0')}`,
    ...req.body,
    riskScore: 5.0, // Default risk score
    lastAssessmentDate: null,
    status: 'active',
    createdAt: new Date().toISOString()
  };
  
  // In a real app, you'd save to database
  mockEmployees.push(newEmployee);
  
  res.status(201).json({
    success: true,
    message: 'Employee created successfully',
    data: newEmployee
  });
});

// PUT update employee
router.put('/:id', (req, res) => {
  const employeeIndex = mockEmployees.findIndex(emp => emp.id === req.params.id);
  
  if (employeeIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found'
    });
  }
  
  mockEmployees[employeeIndex] = {
    ...mockEmployees[employeeIndex],
    ...req.body,
    id: req.params.id, // Ensure ID doesn't change
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Employee updated successfully',
    data: mockEmployees[employeeIndex]
  });
});

module.exports = router;