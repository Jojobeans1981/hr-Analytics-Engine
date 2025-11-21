"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAssessmentRequest = exports.validateAssessment = void 0;
const validateAssessment = (data) => {
    if (!data.teamId)
        return 'Team ID is required';
    if (!data.assessorId)
        return 'Assessor ID is required';
    if (!data.scores || typeof data.scores !== 'object')
        return 'Scores are required';
    return null;
};
exports.validateAssessment = validateAssessment;
const validateAssessmentRequest = (req) => {
    return (0, exports.validateAssessment)(req.body);
};
exports.validateAssessmentRequest = validateAssessmentRequest;
