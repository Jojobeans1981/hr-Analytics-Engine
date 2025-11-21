"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTeamRequest = exports.validateTeam = void 0;
const validateTeam = (data) => {
    if (!data.name?.trim())
        return 'Team name is required';
    if (data.name.length < 2)
        return 'Team name must be at least 2 characters';
    if (data.name.length > 50)
        return 'Team name must be less than 50 characters';
    return null;
};
exports.validateTeam = validateTeam;
const validateTeamRequest = (req) => {
    return (0, exports.validateTeam)(req.body);
};
exports.validateTeamRequest = validateTeamRequest;
