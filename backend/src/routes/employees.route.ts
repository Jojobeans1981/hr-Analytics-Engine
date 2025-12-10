import { Router } from 'express';
const router = Router();

// GET all employees
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'John Doe', email: 'john@company.com', department: 'Engineering', riskLevel: 'medium' },
      { id: 2, name: 'Jane Smith', email: 'jane@company.com', department: 'Sales', riskLevel: 'low' },
      { id: 3, name: 'Bob Johnson', email: 'bob@company.com', department: 'Marketing', riskLevel: 'high' }
    ]
  });
});

// GET employee by ID
router.get('/:id', (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.params.id,
      name: 'John Doe',
      email: 'john@company.com',
      position: 'Senior Developer',
      department: 'Engineering',
      manager: 'Sarah Wilson',
      hireDate: '2022-03-15',
      riskScore: 6.8,
      lastAssessment: '2024-01-10'
    }
  });
});

// POST create new employee
router.post('/', (req, res) => {
  res.json({
    success: true,
    data: req.body,
    message: 'Employee created successfully'
  });
});

// PUT update employee
router.put('/:id', (req, res) => {
  res.json({
    success: true,
    data: { id: req.params.id, ...req.body },
    message: 'Employee updated successfully'
  });
});

// DELETE employee
router.delete('/:id', (req, res) => {
  res.json({
    success: true,
    message: `Employee ${req.params.id} deleted successfully`
  });
});

// GET employee search
router.get('/search', (req, res) => {
  const { name, department, riskLevel } = req.query;
  res.json({
    success: true,
    filters: { name, department, riskLevel },
    results: [
      { id: 1, name: 'John Doe', department: 'Engineering', riskLevel: 'medium' }
    ]
  });
});

export default router;