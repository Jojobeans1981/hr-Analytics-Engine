import { Assessment, type AssessmentDocument } from '../models/assessment.model.js';
import { 
  type AssessmentCreateDto, 
  type AssessmentResponseDto,
  type AssessmentUpdateDto
} from '../dtos/assessment.dto.js';
import { ApiError } from '../errors/api.error.js';
import { Types } from 'mongoose';
import { RiskPredictor } from './risk-predictor.service.js';
import { EmployeeService } from './employee.service.js';

export class AssessmentService {
  private static riskPredictor = new RiskPredictor();

  static async create(
    data: AssessmentCreateDto, 
    userId: string
  ): Promise<AssessmentResponseDto> {
    try {
      const employee = await EmployeeService.getById(data.employeeId);
      const tenureInMonths = this.calculateTenure(employee.hireDate);

      const riskPrediction = await this.riskPredictor.predict({
        engagement: data.metrics.engagement,
        performance: data.metrics.performance,
        riskFactors: data.metrics.riskFactors,
        tenureInMonths
      });

      const assessment = await Assessment.create({
        ...data,
        employeeId: new Types.ObjectId(data.employeeId),
        createdBy: new Types.ObjectId(userId),
        overallRisk: riskPrediction.score,
        assessmentDate: new Date()
      });

      await EmployeeService.updateRiskScore(data.employeeId, riskPrediction.score);

      return this.toResponseDto(assessment);
    } catch (error) {
      console.error('Failed to create assessment:', error);
      throw new ApiError('Failed to create assessment', 500);
    }
  }

  static async getById(id: string): Promise<AssessmentResponseDto> {
    try {
      const assessment = await Assessment.findById(id);
      if (!assessment) {
        throw new ApiError('Assessment not found', 404);
      }
      return this.toResponseDto(assessment);
    } catch (error) {
      console.error('Failed to get assessment:', error);
      throw new ApiError('Failed to retrieve assessment', 500);
    }
  }

  static async getByEmployee(
    employeeId: string
  ): Promise<AssessmentResponseDto[]> {
    try {
      const assessments = await Assessment.find({ 
        employeeId: new Types.ObjectId(employeeId) 
      }).sort({ assessmentDate: -1 });
      
      return assessments.map(assessment => 
        this.toResponseDto(assessment)
      );
    } catch (error) {
      console.error('Failed to get employee assessments:', error);
      throw new ApiError('Failed to retrieve assessments', 500);
    }
  }

  static async update(
    id: string, 
    data: AssessmentUpdateDto
  ): Promise<AssessmentResponseDto> {
    try {
      const assessment = await Assessment.findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true }
      );

      if (!assessment) {
        throw new ApiError('Assessment not found', 404);
      }

      if (data.metrics) {
        const employee = await EmployeeService.getById(assessment.employeeId.toString());
        const tenureInMonths = this.calculateTenure(employee.hireDate);
        
        const riskPrediction = await this.riskPredictor.predict({
          engagement: data.metrics.engagement ?? assessment.metrics.engagement,
          performance: data.metrics.performance ?? assessment.metrics.performance,
          riskFactors: data.metrics.riskFactors ?? assessment.metrics.riskFactors,
          tenureInMonths
        });

        assessment.overallRisk = riskPrediction.score;
        await assessment.save();

        await EmployeeService.updateRiskScore(
          assessment.employeeId.toString(), 
          riskPrediction.score
        );
      }

      return this.toResponseDto(assessment);
    } catch (error) {
      console.error('Failed to update assessment:', error);
      throw new ApiError('Failed to update assessment', 500);
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const result = await Assessment.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        throw new ApiError('Assessment not found', 404);
      }
    } catch (error) {
      console.error('Failed to delete assessment:', error);
      throw new ApiError('Failed to delete assessment', 500);
    }
  }

  private static calculateTenure(hireDate: Date): number {
    const now = new Date();
    const diffInMonths = (now.getFullYear() - hireDate.getFullYear()) * 12 + 
                        (now.getMonth() - hireDate.getMonth());
    return Math.max(0, diffInMonths);
  }

  private static toResponseDto(
    assessment: AssessmentDocument
  ): AssessmentResponseDto {
    return {
      id: assessment._id.toString(),
      employeeId: assessment.employeeId.toString(),
      metrics: assessment.metrics,
      overallRisk: assessment.overallRisk,
      assessmentDate: assessment.assessmentDate,
      notes: assessment.notes,
      createdAt: assessment.createdAt,
      updatedAt: assessment.updatedAt
    };
  }
}