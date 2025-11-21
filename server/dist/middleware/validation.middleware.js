"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = void 0;
const validationMiddleware = (req, res, next) => {
    if ((req.method === 'POST' || req.method === 'PUT') && !req.body) {
        res.status(400).json({ success: false, error: 'Request body is required' });
        return;
    }
    next();
};
exports.validationMiddleware = validationMiddleware;
