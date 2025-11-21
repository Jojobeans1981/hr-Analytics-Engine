"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAuthRequest = exports.validateAuth = void 0;
const validateAuth = (data) => {
    if (!data.email)
        return 'Email is required';
    if (!data.password)
        return 'Password is required';
    if (!/\S+@\S+\.\S+/.test(data.email))
        return 'Valid email is required';
    return null;
};
exports.validateAuth = validateAuth;
const validateAuthRequest = (req) => {
    return (0, exports.validateAuth)(req.body);
};
exports.validateAuthRequest = validateAuthRequest;
