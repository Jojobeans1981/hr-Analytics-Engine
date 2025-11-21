"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentService = void 0;
const mongodb_1 = require("mongodb");
const connect_1 = require("../db/connect");
const apiError_1 = require("../errors/apiError");
class AssessmentService {
    // private static riskPredictor = new RiskPredictor();
    static async create(data, userId) {
        try {
            const db = await (0, connect_1.getDb)();
            const collection = db.collection('assessments');
            // For now, use simple risk calculation
            const overallRisk = this.calculateSimpleRisk(data.metrics);
            const newAssessment = {
                _id: new mongodb_1.ObjectId(),
                employeeId: new mongodb_1.ObjectId(data.employeeId),
                metrics: data.metrics,
                overallRisk,
                assessmentDate: new Date(),
                notes: data.notes,
                createdBy: new mongodb_1.ObjectId(userId),
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const result = await collection.insertOne(newAssessment);
            // Update employee risk score
            // await EmployeeService.updateRiskScore(data.employeeId, overallRisk);
            return this.toResponseDto(newAssessment);
        }
        catch (error) {
            console.error('Failed to create assessment:', error);
            throw new apiError_1.ApiError('Failed to create assessment', 500);
        }
    }
    static async getById(id) {
        try {
            const db = await (0, connect_1.getDb)();
            const collection = db.collection('assessments');
            const assessment = await collection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!assessment) {
                throw new apiError_1.ApiError('Assessment not found', 404);
            }
            return this.toResponseDto(assessment);
        }
        catch (error) {
            console.error('Failed to get assessment:', error);
            throw new apiError_1.ApiError('Failed to retrieve assessment', 500);
        }
    }
    static async getByEmployee(employeeId) {
        try {
            const db = await (0, connect_1.getDb)();
            const collection = db.collection('assessments');
            const assessments = await collection.find({
                employeeId: new mongodb_1.ObjectId(employeeId)
            }).sort({ assessmentDate: -1 }).toArray();
            return assessments.map(assessment => this.toResponseDto(assessment));
        }
        catch (error) {
            console.error('Failed to get employee assessments:', error);
            throw new apiError_1.ApiError('Failed to retrieve assessments', 500);
        }
    }
    static async update(id, data) {
        try {
            const db = await (0, connect_1.getDb)();
            const collection = db.collection('assessments');
            const updateData = {
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
            const result = await collection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: updateData }, { returnDocument: 'after' });
            if (!result) {
                throw new apiError_1.ApiError('Assessment not found', 404);
            }
            return this.toResponseDto(result);
        }
        catch (error) {
            console.error('Failed to update assessment:', error);
            throw new apiError_1.ApiError('Failed to update assessment', 500);
        }
    }
    static async delete(id) {
        try {
            const db = await (0, connect_1.getDb)();
            const collection = db.collection('assessments');
            const result = await collection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            if (result.deletedCount === 0) {
                throw new apiError_1.ApiError('Assessment not found', 404);
            }
        }
        catch (error) {
            console.error('Failed to delete assessment:', error);
            throw new apiError_1.ApiError('Failed to delete assessment', 500);
        }
    }
    static calculateSimpleRisk(metrics) {
        // Simple risk calculation - replace with your actual logic
        let risk = 0.25; // Base risk
        if (metrics.engagement < 3)
            risk += 0.2;
        if (metrics.performance < 3)
            risk += 0.2;
        if (metrics.riskFactors.length > 2)
            risk += 0.1;
        return Math.min(risk, 1.0) * 100; // Convert to percentage
    }
    static toResponseDto(assessment) {
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
exports.AssessmentService = AssessmentService;
