import { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service';
import { ObjectId } from 'mongodb';

// Create simple AuthenticatedRequest type
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export class EmployeeController {
  static async getEmployee(req: Request, res: Response) {
    try {
      const employee = await EmployeeService.getEmployeeById(new ObjectId(req.params.id));
      res.json({
        success: true,
        data: employee
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get employee'
      });
    }
  }

  static async calculateRisk(req: AuthenticatedRequest, res: Response) {
    try {
      // Simple risk calculation - replace with actual logic
      const employee = await EmployeeService.getEmployeeById(new ObjectId(req.params.id));
      const riskData = {
        riskScore: employee.riskScore || 25,
        factors: ['tenure', 'performance', 'engagement'] // placeholder
      };
      
      res.json({
        success: true,
        data: riskData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to calculate risk'
      });
    }
  }

  static async updateEmployee(req: Request, res: Response) {
    try {
      const employee = await EmployeeService.updateEmployee(
        new ObjectId(req.params.id),
        req.body
      );
      res.json({
        success: true,
        data: employee
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update employee'
      });
    }
  }
}