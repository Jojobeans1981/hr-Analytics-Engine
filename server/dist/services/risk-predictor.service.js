"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../utils/logger");
const sentiment_analyzer_service_1 = __importDefault(require("./sentiment-analyzer.service"));
const skills_analyzer_service_1 = __importDefault(require("./skills-analyzer.service"));
const logger = (0, logger_1.createLogger)('RiskPredictor');
class RiskPredictorService {
    constructor() {
        this.initialized = false;
        this.weights = {
            sentiment: 0.3,
            skills: 0.25,
            experience: 0.2,
            performance: 0.25
        };
    }
    async initialize() {
        try {
            logger.info('Initializing Risk Predictor...');
            if (!sentiment_analyzer_service_1.default.isInitialized()) {
                await sentiment_analyzer_service_1.default.initialize();
            }
            this.initialized = true;
            logger.info('✅ Risk Predictor initialized successfully');
        }
        catch (error) {
            logger.error('Initialization failed', error);
            throw error;
        }
    }
    async predictRisk(employeeData) {
        if (!this.initialized) {
            throw new Error('Risk predictor not initialized');
        }
        const startTime = Date.now();
        try {
            const [sentiment, skills] = await Promise.all([
                sentiment_analyzer_service_1.default.analyzeSentiment(employeeData.feedback),
                skills_analyzer_service_1.default.analyzeSkills(employeeData.skillsText)
            ]);
            const factors = {
                sentiment: this.normalizeSentiment(sentiment.score),
                skills: skills.overallScore / 6,
                experience: Math.min(employeeData.experience / 10, 1),
                performance: this.getPerformanceScore(employeeData.performance)
            };
            const riskScore = this.calculateRiskScore(factors);
            const riskLevel = this.determineRiskLevel(riskScore);
            const recommendations = this.generateRecommendations(riskLevel, factors, sentiment, skills);
            logger.debug(`Risk prediction completed in ${Date.now() - startTime}ms`);
            return {
                riskScore,
                riskLevel,
                factors,
                recommendations,
                timestamp: new Date()
            };
        }
        catch (error) {
            logger.error('Prediction failed', { employeeId: employeeData.id, error });
            throw error;
        }
    }
    calculateRiskScore(factors) {
        return ((1 - factors.sentiment) * this.weights.sentiment +
            (1 - factors.skills) * this.weights.skills +
            (1 - factors.experience) * this.weights.experience +
            (1 - factors.performance) * this.weights.performance);
    }
    determineRiskLevel(score) {
        if (score < 0.3)
            return 'low';
        if (score < 0.6)
            return 'medium';
        return 'high';
    }
    normalizeSentiment(score) {
        return (score + 1) / 2;
    }
    getPerformanceScore(performance) {
        const performanceMap = {
            'excellent': 1.0,
            'good': 0.8,
            'average': 0.6,
            'below_average': 0.4,
            'poor': 0.2
        };
        return performanceMap[performance.toLowerCase()] || 0.6;
    }
    generateRecommendations(riskLevel, factors, sentimentAnalysis, skillsAnalysis) {
        const recommendations = [];
        if (riskLevel === 'high') {
            recommendations.push('🚨 Schedule immediate one-on-one meeting');
            recommendations.push('📋 Review current workload and responsibilities');
        }
        if (riskLevel === 'medium') {
            recommendations.push('📅 Increase check-in frequency to weekly');
        }
        if (factors.sentiment < 0.3) {
            recommendations.push('💬 Conduct feedback session to address concerns');
        }
        if (factors.skills < 0.5) {
            recommendations.push('📚 Provide targeted training opportunities');
        }
        if (factors.experience < 0.3) {
            recommendations.push('👥 Assign mentor for guidance');
        }
        if (factors.performance < 0.5) {
            recommendations.push('🎯 Create performance improvement plan');
        }
        return recommendations.length > 0
            ? recommendations
            : ['✅ Continue current engagement strategy'];
    }
    updateWeights(newWeights) {
        this.weights = { ...this.weights, ...newWeights };
        logger.info('Updated risk weights', { weights: this.weights });
    }
    isInitialized() {
        return this.initialized;
    }
}
exports.default = RiskPredictorService;
