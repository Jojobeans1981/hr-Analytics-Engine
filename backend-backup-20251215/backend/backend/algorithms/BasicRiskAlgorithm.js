const RiskAlgorithmBase = require('./RiskAlgorithmBase');

class BasicRiskAlgorithm extends RiskAlgorithmBase {
  constructor(config = {}) {
    super({
      weights: {
        tenure: 0.20,
        performance: 0.30,
        engagement: 0.25,
        market_demand: 0.15,
        compensation: 0.10
      },
      ...config
    });
  }
  
  calculate(employeeData, factors = {}) {
    const validation = this.validateData(employeeData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    // Calculate individual factor scores
    const tenureScore = this.calculateTenureScore(employeeData);
    const performanceScore = this.calculatePerformanceScore(employeeData);
    const engagementScore = this.calculateEngagementScore(factors);
    const marketScore = this.calculateMarketScore(factors);
    const compensationScore = this.calculateCompensationScore(employeeData, factors);
    
    // Apply weights and calculate total
    const weightedScore = 
      this.applyWeight(tenureScore, this.weights.tenure) +
      this.applyWeight(performanceScore, this.weights.performance) +
      this.applyWeight(engagementScore, this.weights.engagement) +
      this.applyWeight(marketScore, this.weights.market_demand) +
      this.applyWeight(compensationScore, this.weights.compensation);
    
    const totalScore = this.normalizeScore(weightedScore);
    const riskLevel = this.getRiskLevel(totalScore);
    
    return {
      score: Math.round(totalScore),
      riskLevel,
      factors: {
        tenure: tenureScore,
        performance: performanceScore,
        engagement: engagementScore,
        marketDemand: marketScore,
        compensation: compensationScore
      },
      weights: this.weights,
      algorithm: 'basic',
      timestamp: new Date()
    };
  }
  
  calculateTenureScore(employeeData) {
    const hireDate = new Date(employeeData.hireDate);
    const now = new Date();
    const tenureMonths = (now - hireDate) / (1000 * 60 * 60 * 24 * 30.44);
    
    if (tenureMonths < 6) return 80; // High risk (new hires)
    if (tenureMonths < 12) return 60;
    if (tenureMonths < 36) return 40;
    if (tenureMonths < 60) return 20; // Low risk (4-5 years)
    return 10; // Very low risk (5+ years)
  }
  
  calculatePerformanceScore(employeeData) {
    const perfScore = employeeData.performanceScore || 50;
    // Invert: high performance = low risk
    return 100 - perfScore;
  }
  
  calculateEngagementScore(factors) {
    const engagement = factors.engagement || 50;
    const lastPromotion = factors.lastPromotion || 24; // months since last promotion
    const trainingHours = factors.trainingHours || 0;
    
    let score = engagement;
    
    // Adjust based on promotion history
    if (lastPromotion > 36) score += 20; // No promotion in 3+ years
    if (lastPromotion > 24) score += 10; // No promotion in 2+ years
    
    // Adjust based on training
    if (trainingHours < 20) score += 10; // Low training investment
    
    return Math.min(100, score);
  }
  
  calculateMarketScore(factors) {
    const marketDemand = factors.marketDemand || 50;
    const competitorOffers = factors.competitorOffers || 0;
    
    let score = marketDemand;
    
    // Adjust for known competitor interest
    if (competitorOffers > 0) score += 20;
    if (competitorOffers > 1) score += 10;
    
    return Math.min(100, score);
  }
  
  calculateCompensationScore(employeeData, factors) {
    const compRatio = factors.compensationRatio || 1.0;
    const lastRaise = factors.lastRaise || 24; // months since last raise
    
    let score = 50;
    
    // Adjust based on compensation ratio (market comparison)
    if (compRatio < 0.8) score += 30; // Underpaid by 20%+
    if (compRatio < 0.9) score += 15; // Underpaid by 10%+
    
    // Adjust based on raise history
    if (lastRaise > 24) score += 20; // No raise in 2+ years
    if (lastRaise > 36) score += 15; // No raise in 3+ years
    
    return Math.min(100, score);
  }
}

module.exports = BasicRiskAlgorithm;
