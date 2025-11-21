"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentController = void 0;
const assessments_service_js_1 = require("../services/assessments.service.js");
class AssessmentController {
    static async createAssessmentSchema(req, res) {
        try {
            // Validation should be handled by middleware in the route definition
            if (!req.user || !req.user.id) {
                return res.status(401).json({
                    success: false,
                    error: { message: 'Unauthorized: User not authenticated.' }
                });
            }
            const assessment = await assessments_service_js_1.AssessmentService.create(req.body, req.user.id);
            const response = {
                success: true,
                data: assessment
            };
            res.status(201).json(response);
        }
        catch (error) {
            const err = error;
            const status = err.statusCode || 500;
            res.status(status).json({
                success: false,
                error: { message: err.message }
            });
        }
    }
    static async getAssessment(req, res) {
        try {
            const assessment = await assessments_service_js_1.AssessmentService.getById(req.params.id);
            const response = {
                success: true,
                data: assessment
            };
            res.status(200).json(response);
        }
        catch (error) {
            const err = error;
            const status = err.statusCode || 500;
            res.status(status).json({
                success: false,
                error: { message: err.message }
            });
        }
    }
    static async getEmployeeAssessments(req, res) {
        try {
            const assessments = await assessments_service_js_1.AssessmentService.getByEmployee(req.params.employeeId);
            const response = {
                success: true,
                data: assessments
            };
            res.status(200).json(response);
        }
        catch (error) {
            const err = error;
            const status = err.statusCode || 500;
            res.status(status).json({
                success: false,
                error: { message: err.message }
            });
        }
    }
    static async updateAssessmentSchema(req, res) {
        try {
            // Validation should be handled by middleware in the route definition
            const assessment = await assessments_service_js_1.AssessmentService.update(req.params.id, req.body);
            const response = {
                success: true,
                data: assessment
            };
            res.status(200).json(response);
        }
        catch (error) {
            const err = error;
            const status = err.statusCode || 500;
            res.status(status).json({
                success: false,
                error: { message: err.message }
            });
        }
    }
    static async deleteAssessment(req, res) {
        try {
            await assessments_service_js_1.AssessmentService.delete(req.params.id);
            const response = {
                success: true,
                data: null
            };
            res.status(204).json(response);
        }
        catch (error) {
            const err = error;
            const status = err.statusCode || 500;
            res.status(status).json({
                success: false,
                error: { message: err.message }
            });
        }
    }
}
exports.AssessmentController = AssessmentController;
