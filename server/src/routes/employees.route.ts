import { Router, Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service';

const router = Router();
const employeeService = new EmployeeService();

// Get all employees with risk assessment
router.get('/', async (req: Request, res: Response) => {
  try {
    const employees = await employeeService.getEmployeesWithRisk();
    
    res.json({
      success: true,
      data: employees,
      count: employees.length,
      riskBreakdown: await employeeService.getRiskBreakdown()
    });
  } catch (error) {
    console.error('Error in getEmployees:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch employees with risk assessment'
    });
  }
});

// Get high-risk employees
router.get('/high-risk', async (req: Request, res: Response) => {
  try {
    const threshold = parseInt(req.query.threshold as string) || 70;
    const highRiskEmployees = await employeeService.getHighRiskEmployees(threshold);
    
    res.json({
      success: true,
      data: highRiskEmployees,
      count: highRiskEmployees.length,
      threshold
    });
  } catch (error) {
    console.error('Error in getHighRiskEmployees:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch high-risk employees'
    });
  }
});

// Get risk breakdown
router.get('/risk-breakdown', async (req: Request, res: Response) => {
  try {
    const breakdown = await employeeService.getRiskBreakdown();
    
    res.json({
      success: true,
      data: breakdown
    });
  } catch (error) {
    console.error('Error in getRiskBreakdown:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch risk breakdown'
    });
  }
});

// Get employee by ID with detailed risk assessment
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const employees = await employeeService.getEmployeesWithRisk();
    const employee = employees.find(emp => 
      emp.id === req.params.id || 
      emp._id?.toString() === req.params.id
    );
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    
    return res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error in getEmployeeById:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch employee'
    });
  }
});

export default router;