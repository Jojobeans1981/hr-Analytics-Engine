"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillsAnalyzerService = void 0;
class SkillsAnalyzerService {
    static async extractSkills(text) {
        return {
            skills: ['JavaScript', 'TypeScript', 'Node.js'],
            confidence: 0.9
        };
    }
}
exports.SkillsAnalyzerService = SkillsAnalyzerService;
