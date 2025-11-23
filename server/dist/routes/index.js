"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assessment_routes_1 = __importDefault(require("./assessment.routes"));
const employees_route_1 = __importDefault(require("./employees.route")); // Updated import
const team_routes_1 = __importDefault(require("./team.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const risk_routes_1 = __importDefault(require("./risk.routes"));
const router = (0, express_1.Router)();
router.use('/assessments', assessment_routes_1.default);
router.use('/employees', employees_route_1.default);
router.use('/teams', team_routes_1.default);
router.use('/auth', auth_routes_1.default);
router.use('/risk', risk_routes_1.default);
exports.default = router;
