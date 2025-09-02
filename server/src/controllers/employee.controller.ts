import { Request, Response } from 'express';
import { EmployeeService } from '../server/src/services/employee.service';
import { ApiResponse } from '../server/src/utils/apiResponse';
import { AuthenticatedRequest } from '../server/src/middleware/auth.middleware';

export class EmployeeController {
  static async getEmployee(req: Request, res: Response) {
    try {
      const employee = await EmployeeService.getById(req.params.id);
      new ApiResponse(employee).send(res);
    } catch (error) {
      ApiResponse.handleError(error, res);
    }
  }

  static async calculateRisk(req: AuthenticatedRequest, res: Response) {
    try {
      const riskData = await EmployeeService.calculateRiskScore(req.params.id);
      new ApiResponse(riskData).send(res);
    } catch (error) {
      ApiResponse.handleError(error, res);
    }
  }

  static async updateEmployee(req: Request, res: Response) {
    try {
      const employee = await EmployeeService.update(
        req.params.id,
        req.body
      );
      new ApiResponse(employee).send(res);
    } catch (error) {
      ApiResponse.handleError(error, res);
    }
  }
}