import { ObjectId, Db } from 'mongodb';
import { getDb } from '../db/connect';
import { ApiError } from '../errors/apiError';
// Remove RiskPredictor for now to avoid compilation issues
// import { RiskPredictor } from './risk-predictor.service.js';
import { EmployeeService } from './employee.service.js';

// Define interfaces
export interface Assessment {
  _id: ObjectId;
  employeeId: ObjectId;
  metrics: {
    engagement: number;
    performance: number;
    riskFactors: string[];
  };
  overallRisk: number;
  assessmentDate: Date;
  notes?: string;
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentCreateDto {
  employeeId: string;
  metrics: {
    engagement: number;
    performance: number;
    riskFactors: string[];
  };
  notes?: string;
}

export interface AssessmentResponseDto {
  id: string;
  employeeId: string;
  metrics: {
    engagement: number;
    performance: number;
    riskFactors: string[];
  };
  overallRisk: number;
  assessmentDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentUpdateDto {
  metrics?: {
    engagement?: number;
    performance?: number;
    riskFactors?: string[];
  };
  notes?: string;
}

export class AssessmentService {
  // private static riskPredictor = new RiskPredictor();

  static async create(
    data: AssessmentCreateDto, 
    userId: string
  ): Promise<AssessmentResponseDto> {
    try {
      const db = await getDb();
      const collection = db.collection<Assessment>('assessments');

      // For now, use simple risk calculation
      const overallRisk = this.calculateSimpleRisk(data.metrics);

      const newAssessment = {
        _id: new ObjectId(),
        employeeId: new ObjectId(data.employeeId),
        metrics: data.metrics,
        overallRisk,
        assessmentDate: new Date(),
        notes: data.notes,
        createdBy: new ObjectId(userId),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await collection.insertOne(newAssessment);
      
      // Update employee risk score
      // await EmployeeService.updateRiskScore(data.employeeId, overallRisk);

      return this.toResponseDto(newAssessment);
    } catch (error) {
      console.error('Failed to create assessment:', error);
      throw new ApiError('Failed to create assessment', 500);
    }
  }

  static async getById(id: string): Promise<AssessmentResponseDto> {
    try {
      const db = await getDb();
      const collection = db.collection<Assessment>('assessments');
      const assessment = await collection.findOne({ _id: new ObjectId(id) });

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
      const db = await getDb();
      const collection = db.collection<Assessment>('assessments');
      const assessments = await collection.find({ 
        employeeId: new ObjectId(employeeId) 
      }).sort({ assessmentDate: -1 }).toArray();
      
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
      const db = await getDb();
      const collection = db.collection<Assessment>('assessments');
      
      const updateData: any = {
        updatedAt: new Date()
      };

      if (data.metrics) {
        updateData.metrics = data.metrics;
        // Simple risk calculation for now - provide default values
        updateData.overallRisk = this.calculateSimpleRisk({
          engagement: data.metrics.engagement ?? 3,
          performance: data.metrics.performance ?? 3,
          riskFactors: data.metrics.riskFactors ?? []
        });
      }

      if (data.notes !== undefined) {
        updateData.notes = data.notes;
      }

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!result) {
        throw new ApiError('Assessment not found', 404);
      }

      return this.toResponseDto(result);
    } catch (error) {
      console.error('Failed to update assessment:', error);
      throw new ApiError('Failed to update assessment', 500);
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const db = await getDb();
      const collection = db.collection<Assessment>('assessments');
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount === 0) {
        throw new ApiError('Assessment not found', 404);
      }
    } catch (error) {
      console.error('Failed to delete assessment:', error);
      throw new ApiError('Failed to delete assessment', 500);
    }
  }

  private static calculateSimpleRisk(metrics: {
    engagement: number;
    performance: number;
    riskFactors: string[];
  }): number {
    // Simple risk calculation - replace with your actual logic
    let risk = 0.25; // Base risk
    
    if (metrics.engagement < 3) risk += 0.2;
    if (metrics.performance < 3) risk += 0.2;
    if (metrics.riskFactors.length > 2) risk += 0.1;
    
    return Math.min(risk, 1.0) * 100; // Convert to percentage
  }

  private static toResponseDto(
    assessment: Assessment
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