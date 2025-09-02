import { createLogger } from '../utils/logger';
import sentimentService, { type SentimentAnalysis } from './sentiment-analyzer.service';
import skillsService, { type SkillsAnalysis } from './skills-analyzer.service';

const logger = createLogger('RiskPredictor');

export interface RiskPrediction {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  factors: {
    sentiment: number;
    skills: number;
    experience: number;
    performance: number;
  };
  recommendations: string[];
  timestamp: Date;
}

export interface EmployeeData {
  id: string;
  name: string;
  role: string;
  experience: number;
  performance: string;
  feedback: string;
  skillsText: string;
}

interface RiskWeights {
  sentiment: number;
  skills: number;
  experience: number;
  performance: number;
}

class RiskPredictorService {
  private initialized = false;
  private weights: RiskWeights = {
    sentiment: 0.3,
    skills: 0.25,
    experience: 0.2,
    performance: 0.25
  };

  async initialize(): Promise<void> {
    try {
      logger.info('Initializing Risk Predictor...');
      
      if (!sentimentService.isInitialized()) {
        await sentimentService.initialize();
      }
      
      this.initialized = true;
      logger.info('✅ Risk Predictor initialized successfully');
    } catch (error) {
      logger.error('Initialization failed', error);
      throw error;
    }
  }

  async predictRisk(employeeData: EmployeeData): Promise<RiskPrediction> {
    if (!this.initialized) {
      throw new Error('Risk predictor not initialized');
    }

    const startTime = Date.now();
    try {
      const [sentiment, skills] = await Promise.all([
        sentimentService.analyzeSentiment(employeeData.feedback),
        skillsService.analyzeSkills(employeeData.skillsText)
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
    } catch (error) {
      logger.error('Prediction failed', { employeeId: employeeData.id, error });
      throw error;
    }
  }

  private calculateRiskScore(factors: {
    sentiment: number;
    skills: number;
    experience: number;
    performance: number;
  }): number {
    return (
      (1 - factors.sentiment) * this.weights.sentiment +
      (1 - factors.skills) * this.weights.skills +
      (1 - factors.experience) * this.weights.experience +
      (1 - factors.performance) * this.weights.performance
    );
  }

  private determineRiskLevel(score: number): 'low' | 'medium' | 'high' {
    if (score < 0.3) return 'low';
    if (score < 0.6) return 'medium';
    return 'high';
  }

  private normalizeSentiment(score: number): number {
    return (score + 1) / 2;
  }

  private getPerformanceScore(performance: string): number {
    const performanceMap: Record<string, number> = {
      'excellent': 1.0,
      'good': 0.8,
      'average': 0.6,
      'below_average': 0.4,
      'poor': 0.2
    };
    return performanceMap[performance.toLowerCase()] || 0.6;
  }

  private generateRecommendations(
    riskLevel: 'low' | 'medium' | 'high',
    factors: { sentiment: number; skills: number; experience: number; performance: number },
    sentimentAnalysis: SentimentAnalysis,
    skillsAnalysis: SkillsAnalysis
  ): string[] {
    const recommendations: string[] = [];

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

  updateWeights(newWeights: Partial<RiskWeights>) {
    this.weights = { ...this.weights, ...newWeights };
    logger.info('Updated risk weights', { weights: this.weights });
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export default RiskPredictorService;