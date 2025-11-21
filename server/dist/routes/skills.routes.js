"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const skills_controller_1 = require("../controllers/skills.controller");
const router = (0, express_1.Router)();
router.post('/extract', skills_controller_1.SkillsController.extractSkills);
router.get('/teams/:teamId', skills_controller_1.SkillsController.analyzeTeamSkills);
exports.default = router;
