"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assessment_controller_1 = require("../controllers/assessment.controller");
const assessment_validation_1 = require("../validations/assessment.validation");
const router = (0, express_1.Router)();
router.post('/', (req, res, next) => {
    const error = (0, assessment_validation_1.validateAssessmentRequest)(req);
    if (error) {
        res.status(400).json({ success: false, error });
        return;
    }
    next();
}, assessment_controller_1.AssessmentController.createAssessment);
router.get('/', assessment_controller_1.AssessmentController.getAllAssessments);
router.get('/:id', assessment_controller_1.AssessmentController.getAssessment);
router.put('/:id', assessment_controller_1.AssessmentController.updateAssessment);
router.delete('/:id', assessment_controller_1.AssessmentController.deleteAssessment);
exports.default = router;
