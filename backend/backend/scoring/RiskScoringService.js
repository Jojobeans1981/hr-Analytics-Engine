const BasicRiskAlgorithm = require('../algorithms/BasicRiskAlgorithm');
const AdvancedPredictiveAlgorithm = require('../algorithms/AdvancedPredictiveAlgorithm');
const MachineLearningAlgorithm = require('../algorithms/MachineLearningAlgorithm');
const { CustomAlgorithmBuilder, PredefinedCalculators, PredefinedRules, PredefinedModifiers } = require('../algorithms/CustomAlgorithmBuilder');
const RISK_CONFIG = require('../config/riskConfig');

class RiskScoringService {
  constructor() {
    this.algorithms = new Map();
    this.initializeAlgorithms();
  }
  
  initializeAlgorithms() {
    // Register built-in algorithms
    this.registerAlgorithm('basic', new BasicRiskAlgorithm());
    this.registerAlgorithm('advanced', new AdvancedPredictiveAlgorithm());
    this.registerAlgorithm('ml', new MachineLearningAlgorithm());
    
    // Register department-specific algorithms
    this.registerAlgorithm('engineering', this.createEngineeringAlgorithm());
    this.registerAlgorithm('sales', this.createSalesAlgorithm());
    this.registerAlgorithm('leadership', this.createLeadershipAlgorithm());
  }
  
  registerAlgorithm(name, algorithm) {
    this.algorithms.set(name, algorithm);
  }
  
  createEngineeringAlgorithm() {
    const builder = new CustomAlgorithmBuilder()
      .setName('Engineering Risk Algorithm')
      .addFactor('tenure', PredefinedCalculators.tenureRisk, 0.10)
      .addFactor('performance', PredefinedCalculators.performanceRisk, 0.25)
      .addFactor('skills_market_demand', (employeeData, factors) => {
        const techStack = factors.techStack || [];
        const skillDemand = factors.skillDemand || {};
        
        let score = 0;
        techStack.forEach(skill => {
          const demand = skillDemand[skill] || 50;
          score = Math.max(score, demand);
        });
        
        return score;
      }, 0.30)
      .addFactor('compensation', PredefinedCalculators.compensationRisk, 0.20)
      .addFactor('career_growth', (employeeData, factors) => {
        const lastPromotion = factors.lastPromotion || 24;
        const trainingHours = factors.trainingHours || 0;
        
        let score = 50;
        if (lastPromotion > 24) score += 20;
        if (trainingHours < 40) score += 15; // Less than 40 hours training per year
        
        return Math.min(100, score);
      }, 0.15)
      .addRule('active_github', (employeeData, factors) => {
        return factors.githubActivity === 'high' || factors.personalProjects > 0;
      }, 15)
      .addRule('conference_speaker', (employeeData, factors) => {
        return factors.conferenceTalks > 0;
      }, 10);
    
    return builder.build();
  }
  
  createSalesAlgorithm() {
    const builder = new CustomAlgorithmBuilder()
      .setName('Sales Risk Algorithm')
      .addFactor('quota_performance', (employeeData, factors) => {
        const quotaAchievement = factors.quotaAchievement || 100;
        return 100 - quotaAchievement; // Lower achievement = higher risk
      }, 0.35)
      .addFactor('client_portfolio', (employeeData, factors) => {
        const keyAccounts = factors.keyAccounts || 0;
        const clientRelationships = factors.clientRelationships || 3;
        
        let score = 50;
        if (keyAccounts > 3) score -= 20; // Many key accounts = lower risk
        if (clientRelationships < 2.5) score += 25; // Poor relationships = higher risk
        
        return score;
      }, 0.25)
      .addFactor('commission_structure', (employeeData, factors) => {
        const commissionRatio = factors.commissionRatio || 0.3;
        const targetAttainment = factors.targetAttainment || 100;
        
        let score = 50;
        if (commissionRatio < 0.2) score += 20; // Low commission = higher risk
        if (targetAttainment < 80) score += 15; // Missing targets = higher risk
        
        return score;
      }, 0.20)
      .addFactor('market_competition', PredefinedCalculators.marketDemandRisk, 0.20)
      .addRule('top_performer', (employeeData, factors) => {
        return factors.quotaAchievement > 120;
      }, -15) // Negative adjustment = lower risk
      .addRule('recent_client_loss', (employeeData, factors) => {
        return factors.recentClientLosses > 0;
      }, 20);
    
    return builder.build();
  }
  
  createLeadershipAlgorithm() {
    const builder = new CustomAlgorithmBuilder()
      .setName('Leadership Risk Algorithm')
      .addFactor('team_performance', (employeeData, factors) => {
        const teamScores = factors.teamPerformanceScores || [];
        const avgTeamScore = teamScores.length > 0 
          ? teamScores.reduce((a, b) => a + b) / teamScores.length 
          : 50;
        
        return 100 - avgTeamScore; // Lower team performance = higher risk
      }, 0.30)
      .addFactor('succession_readiness', (employeeData, factors) => {
        const hasSuccessor = factors.hasSuccessor || false;
        const successorReadiness = factors.successorReadiness || 0;
        
        let score = 50;
        if (!hasSuccessor) score += 30;
        if (successorReadiness < 70) score += 20;
        
        return Math.min(100, score);
      }, 0.25)
      .addFactor('strategic_impact', (employeeData, factors) => {
        const strategicProjects = factors.strategicProjects || 0;
        const departmentGrowth = factors.departmentGrowth || 0;
        
        let score = 50;
        if (strategicProjects > 2) score -= 20; // High impact = lower risk
        if (departmentGrowth > 20) score -= 15; // High growth = lower risk
        
        return Math.max(0, score);
      }, 0.20)
      .addFactor('compensation', PredefinedCalculators.compensationRisk, 0.15)
      .addFactor('tenure', PredefinedCalculators.tenureRisk, 0.10)
      .addModifier(PredefinedModifiers.criticalRoleProtection);
    
    return builder.build();
  }
  
  /**
   * Calculate risk score using specified algorithm
   * @param {Object} employeeData - Employee data
   * @param {Object} riskFactors - Risk factors
   * @param {string} algorithmName - Algorithm to use
   * @returns {Promise<Object>} Risk score result
   */
  async calculateRisk(employeeData, riskFactors = {}, algorithmName = 'auto') {
    try {
      // Determine which algorithm to use
      const algorithm = this.selectAlgorithm(algorithmName, employeeData);
      
      if (!algorithm) {
        throw new Error(`Algorithm not found: ${algorithmName}`);
      }
      
      // Calculate risk score
      const result = await algorithm.calculate(employeeData, riskFactors);
      
      // Enhance result with additional metadata
      result.employeeId = employeeData._id || employeeData.employeeId;
      result.employeeName = employeeData.name;
      result.department = employeeData.department;
      result.algorithmUsed = algorithm.algorithmName || algorithmName;
      
      // Calculate risk trend if historical data available
      if (riskFactors.historicalScores) {
        result.trend = this.calculateTrend(riskFactors.historicalScores, result.score);
      }
      
      // Generate risk insights
      result.insights = this.generateInsights(result, employeeData, riskFactors);
      
      return result;
      
    } catch (error) {
      console.error('Error calculating risk score:', error);
      throw new Error(`Risk calculation failed: ${error.message}`);
    }
  }
  
  /**
   * Select appropriate algorithm
   * @param {string} algorithmName - Requested algorithm
   * @param {Object} employeeData - Employee data
   * @returns {RiskAlgorithmBase} Selected algorithm
   */
  selectAlgorithm(algorithmName, employeeData) {
    if (algorithmName !== 'auto' && this.algorithms.has(algorithmName)) {
      return this.algorithms.get(algorithmName);
    }
    
    // Auto-select based on employee characteristics
    if (employeeData.department === 'Engineering') {
      return this.algorithms.get('engineering');
    }
    
    if (employeeData.department === 'Sales') {
      return this.algorithms.get('sales');
    }
    
    if (employeeData.position && employeeData.position.toLowerCase().includes('manager')) {
      return this.algorithms.get('leadership');
    }
    
    // Default to advanced algorithm for high-risk employees
    if (employeeData.riskScore > 60) {
      return this.algorithms.get('advanced');
    }
    
    return this.algorithms.get('basic');
  }
  
  /**
   * Calculate risk trend
   * @param {Array} historicalScores - Previous risk scores
   * @param {number} currentScore - Current risk score
   * @returns {Object} Trend analysis
   */
  calculateTrend(historicalScores, currentScore) {
    if (!historicalScores || historicalScores.length === 0) {
      return { direction: 'stable', change: 0, confidence: 0 };
    }
    
    const recentScores = historicalScores.slice(-3);
    const avgRecent = recentScores.reduce((a, b) => a + b) / recentScores.length;
    const change = currentScore - avgRecent;
    
    let direction = 'stable';
    if (change > 10) direction = 'increasing_rapidly';
    else if (change > 5) direction = 'increasing';
    else if (change < -10) direction = 'decreasing_rapidly';
    else if (change < -5) direction = 'decreasing';
    
    // Calculate confidence based on data points
    const confidence = Math.min(100, historicalScores.length * 20);
    
    return {
      direction,
      change: Math.round(change * 10) / 10,
      confidence,
      historicalCount: historicalScores.length
    };
  }
  
  /**
   * Generate risk insights
   * @param {Object} result - Risk calculation result
   * @param {Object} employeeData - Employee data
   * @param {Object} riskFactors - Risk factors
   * @returns {Array} List of insights
   */
  generateInsights(result, employeeData, riskFactors) {
    const insights = [];
    
    // High risk insights
    if (result.score >= 70) {
      insights.push({
        level: 'critical',
        message: 'High risk of attrition - immediate action required',
        factors: Object.keys(result.factors || {}).filter(k => result.factors[k] > 70)
      });
    }
    
    // Factor-specific insights
    if (result.factors) {
      const highFactors = Object.entries(result.factors)
        .filter(([_, score]) => score > 70)
        .map(([name]) => name);
      
      if (highFactors.length > 0) {
        insights.push({
          level: 'warning',
          message: `High risk factors detected: ${highFactors.join(', ')}`,
          factors: highFactors
        });
      }
    }
    
    // Trend insights
    if (result.trend && result.trend.direction !== 'stable') {
      insights.push({
        level: result.trend.direction.includes('increasing') ? 'warning' : 'positive',
        message: `Risk trend is ${result.trend.direction.replace('_', ' ')}`,
        change: result.trend.change
      });
    }
    
    // Compensation insights
    if (riskFactors.compensationRatio < 0.85) {
      insights.push({
        level: 'warning',
        message: 'Compensation below market average',
        details: `${Math.round((1 - riskFactors.compensationRatio) * 100)}% below market`
      });
    }
    
    // Tenure insights
    if (employeeData.hireDate) {
      const hireDate = new Date(employeeData.hireDate);
      const tenureMonths = (Date.now() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
      
      if (tenureMonths < 12) {
        insights.push({
          level: 'info',
          message: 'New hire - higher risk period',
          tenure: `${Math.round(tenureMonths)} months`
        });
      }
    }
    
    return insights;
  }
  
  /**
   * Batch calculate risk scores for multiple employees
   * @param {Array} employees - List of employees
   * @param {Object} riskFactorsMap - Map of risk factors by employee ID
   * @param {string} algorithmName - Algorithm to use
   * @returns {Promise<Array>} List of risk results
   */
  async batchCalculate(employees, riskFactorsMap = {}, algorithmName = 'auto') {
    const results = [];
    
    for (const employee of employees) {
      try {
        const riskFactors = riskFactorsMap[employee._id] || riskFactorsMap[employee.employeeId] || {};
        const result = await this.calculateRisk(employee, riskFactors, algorithmName);
        results.push(result);
      } catch (error) {
        console.error(`Error calculating risk for ${employee.name}:`, error);
        results.push({
          employeeId: employee._id,
          employeeName: employee.name,
          error: error.message,
          score: null,
          riskLevel: 'UNKNOWN'
        });
      }
    }
    
    return results;
  }
  
  /**
   * Compare different algorithms for an employee
   * @param {Object} employeeData - Employee data
   * @param {Object} riskFactors - Risk factors
   * @returns {Promise<Object>} Comparison results
   */
  async compareAlgorithms(employeeData, riskFactors = {}) {
    const comparison = {};
    
    for (const [name, algorithm] of this.algorithms) {
      try {
        const result = await algorithm.calculate(employeeData, riskFactors);
        comparison[name] = {
          score: result.score,
          riskLevel: result.riskLevel,
          confidence: result.confidence,
          factors: result.factors
        };
      } catch (error) {
        comparison[name] = { error: error.message };
      }
    }
    
    // Calculate algorithm agreement
    const scores = Object.values(comparison)
      .filter(r => r && r.score)
      .map(r => r.score);
    
    if (scores.length > 1) {
      const avgScore = scores.reduce((a, b) => a + b) / scores.length;
      const variance = scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / scores.length;
      
      comparison.meta = {
        averageScore: Math.round(avgScore),
        scoreVariance: Math.round(variance),
        algorithmCount: scores.length
      };
    }
    
    return comparison;
  }
  
  /**
   * Create custom algorithm from configuration
   * @param {Object} config - Algorithm configuration
   * @returns {CustomAlgorithm} Custom algorithm
   */
  createCustomAlgorithm(config) {
    const { CustomAlgorithmBuilder } = require('../algorithms/CustomAlgorithmBuilder');
    return CustomAlgorithmBuilder.fromConfig(config);
  }
}

// Create singleton instance
const riskScoringService = new RiskScoringService();

module.exports = riskScoringService;
