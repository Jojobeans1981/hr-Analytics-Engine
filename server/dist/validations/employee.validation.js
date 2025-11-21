"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmployeeRequest = exports.validateEmployee = void 0;
const validateEmployee = (data) => {
    if (!data.name?.trim())
        return 'Name is required';
    if (!data.email)
        return 'Email is required';
    if (!data.position)
        return 'Position is required';
    if (!data.department)
        return 'Department is required';
    if (!/\S+@\S+\.\S+/.test(data.email))
        return 'Valid email is required';
    return null;
};
exports.validateEmployee = validateEmployee;
const validateEmployeeRequest = (req) => {
    return (0, exports.validateEmployee)(req.body);
};
exports.validateEmployeeRequest = validateEmployeeRequest;
