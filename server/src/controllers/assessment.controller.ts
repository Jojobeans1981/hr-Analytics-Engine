import { Request, Response } from 'express';
import { AssessmentService } from '../services/assessments.service.js';
import { ApiResponse } from '../dtos/api-response.dto.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { 
  createAssessmentSchema,
  updateAssessmentSchema
} from '../validations/assessment.validation.js';


type AppError = Error & { statusCode?: number };


export class AssessmentController {
  static async createAssessmentSchema(req: Request, res: Response) {
    try {
      // Validation should be handled by middleware in the route definition
      
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          error: { message: 'Unauthorized: User not authenticated.' }
        });
      }

      const assessment = await AssessmentService.create(
        req.body,
        req.user.id
      );

      const response: ApiResponse<typeof assessment> = {
        success: true,
        data: assessment
      };

      res.status(201).json(response);
    } catch (error) {
      const err = error as AppError;
      const status = err.statusCode || 500;
      res.status(status).json({
        success: false,
        error: { message: err.message }
      });
    }
  }

  static async getAssessment(req: Request, res: Response) {
    try {
      const assessment = await AssessmentService.getById(req.params.id);
      
      const response: ApiResponse<typeof assessment> = {
        success: true,
        data: assessment
      };

      res.status(200).json(response);
    } catch (error) {
      const err = error as AppError;
      const status = err.statusCode || 500;
      res.status(status).json({
        success: false,
        error: { message: err.message }
      });
    }
  }

  static async getEmployeeAssessments(req: Request, res: Response) {
    try {
      const assessments = await AssessmentService.getByEmployee(
        req.params.employeeId
      );
      
      const response: ApiResponse<typeof assessments> = {
        success: true,
        data: assessments
      };

      res.status(200).json(response);
    } catch (error) {
      const err = error as AppError;
      const status = err.statusCode || 500;
      res.status(status).json({
        success: false,
        error: { message: err.message }
      });
    }
  }

  static async updateAssessmentSchema(req: Request, res: Response) {
    try {
      // Validation should be handled by middleware in the route definition
      
      const assessment = await AssessmentService.update(
        req.params.id,
        req.body
      );
      
      const response: ApiResponse<typeof assessment> = {
        success: true,
        data: assessment
      };

      res.status(200).json(response);
    } catch (error) {
      const err = error as AppError;
      const status = err.statusCode || 500;
      res.status(status).json({
        success: false,
        error: { message: err.message }
      });
    }
  }

  static async deleteAssessment(req: Request, res: Response) {
    try {
      await AssessmentService.delete(req.params.id);
      
      const response: ApiResponse<null> = {
        success: true,
        data: null
      };

      res.status(204).json(response);
    } catch (error) {
      const err = error as AppError;
      const status = err.statusCode || 500;
      res.status(status).json({
        success: false,
        error: { message: err.message }
      });
    }
  }
}