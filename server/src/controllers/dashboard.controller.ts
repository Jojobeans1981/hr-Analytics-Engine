import { Request, Response } from 'express';
import { DashboardService } from '../server/src/services/dashboard.service';
import { ApiResponse } from '../server/src/utils/apiResponse';

export class DashboardController {
  static async getDashboardData(req: Request, res: Response) {
    try {
      const data = await DashboardService.getData();
      new ApiResponse(data).send(res);
    } catch (error) {
      ApiResponse.handleError(error, res);
    }
  }

  static async getRiskTrends(req: Request, res: Response) {
    try {
      const trends = await DashboardService.getRiskTrends();
      new ApiResponse(trends).send(res);
    } catch (error) {
      ApiResponse.handleError(error, res);
    }
  }
}