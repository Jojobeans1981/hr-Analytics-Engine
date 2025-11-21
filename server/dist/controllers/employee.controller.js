"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeController = void 0;
const employee_service_1 = require("../services/employee.service");
const mongodb_1 = require("mongodb");
class EmployeeController {
    static async getEmployee(req, res) {
        try {
            const employee = await employee_service_1.EmployeeService.getEmployeeById(new mongodb_1.ObjectId(req.params.id));
            res.json({
                success: true,
                data: employee
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to get employee'
            });
        }
    }
    static async calculateRisk(req, res) {
        try {
            // Simple risk calculation - replace with actual logic
            const employee = await employee_service_1.EmployeeService.getEmployeeById(new mongodb_1.ObjectId(req.params.id));
            const riskData = {
                riskScore: employee.riskScore || 25,
                factors: ['tenure', 'performance', 'engagement'] // placeholder
            };
            res.json({
                success: true,
                data: riskData
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to calculate risk'
            });
        }
    }
    static async updateEmployee(req, res) {
        try {
            const employee = await employee_service_1.EmployeeService.updateEmployee(new mongodb_1.ObjectId(req.params.id), req.body);
            res.json({
                success: true,
                data: employee
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to update employee'
            });
        }
    }
}
exports.EmployeeController = EmployeeController;
