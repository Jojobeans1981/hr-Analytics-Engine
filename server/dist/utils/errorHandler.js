"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = handleError;
const apiError_1 = require("../errors/apiError");
function handleError(error) {
    if (error instanceof apiError_1.ApiError) {
        return {
            status: error.statusCode,
            message: error.message,
            details: error.details
        };
    }
    if (error instanceof Error) {
        return {
            status: 500,
            message: error.message
        };
    }
    return {
        status: 500,
        message: 'An unknown error occurred'
    };
}
