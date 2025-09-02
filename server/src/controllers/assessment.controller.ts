import { Request, Response } from 'express';
import { AssessmentService } from '../server/src/services/assessment.service';
import { ApiResponse } from '../server/src/dtos/api-response.dto';
import { validateRequest } from '../server/src/middleware/validation.middleware';
import { 
  assessmentCreateSchema,
  assessmentUpdateSchema
} from '../server/src/validations/assessment.validation';

export class AssessmentController {
  static async createAssessment(req: Request, res: Response) {
    try {
      await validateRequest(assessmentCreateSchema, req);
      
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
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        error: { message: error.message }
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
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        error: { message: error.message }
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
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        error: { message: error.message }
      });
    }
  }

  static async updateAssessment(req: Request, res: Response) {
    try {
      await validateRequest(assessmentUpdateSchema, req);
      
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
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        error: { message: error.message }
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
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        error: { message: error.message }
      });
    }
  }
}