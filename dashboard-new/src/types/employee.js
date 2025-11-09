"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmployee = isEmployee;
/**
 * Type guard for Employee
 */
function isEmployee(obj) {
    return (typeof obj === 'object' &&
        obj !== null &&
        'firstName' in obj &&
        'lastName' in obj &&
        'department' in obj);
}
