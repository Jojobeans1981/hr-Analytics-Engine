"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_validation_1 = require("../validations/auth.validation");
const router = (0, express_1.Router)();
const validateAuth = (req, res, next) => {
    const error = (0, auth_validation_1.validateAuthRequest)(req);
    if (error) {
        res.status(400).json({ success: false, error });
        return;
    }
    next();
};
router.post('/login', validateAuth, auth_controller_1.AuthController.login);
router.post('/register', validateAuth, auth_controller_1.AuthController.register);
router.post('/logout', auth_controller_1.AuthController.logout);
router.post('/refresh', auth_controller_1.AuthController.refreshToken);
exports.default = router;
