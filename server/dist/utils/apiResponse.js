"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    static success(res, data, message) {
        res.json({ success: true, data, message });
    }
    static error(res, error, code = 500) {
        res.status(code).json({ success: false, error });
    }
    static created(res, data) {
        res.status(201).json({ success: true, data });
    }
    static notFound(res, message = 'Resource not found') {
        res.status(404).json({ success: false, error: message });
    }
    static badRequest(res, message) {
        res.status(400).json({ success: false, error: message });
    }
    static unauthorized(res, message = 'Unauthorized') {
        res.status(401).json({ success: false, error: message });
    }
}
exports.ApiResponse = ApiResponse;
