"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireManager = exports.requireAdmin = void 0;
const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};
exports.requireAdmin = requireAdmin;
const requireManager = (req, res, next) => {
    if (!req.user || !['admin', 'manager'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Manager access required' });
    }
    next();
};
exports.requireManager = requireManager;
