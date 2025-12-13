const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployee,
  getEmployeeStats,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');

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

module.exports = router;
