const RiskAlgorithmBase = require('./RiskAlgorithmBase');

class CustomAlgorithmBuilder {
  constructor() {
    this.factors = new Map();
    this.weights = new Map();
    this.rules = [];
    this.modifiers = [];
    this.name = 'Custom Algorithm';
  }
  
  /**
   * Add a custom factor to the algorithm
   * @param {string} name - Factor name
   * @param {Function} calculator - Function to calculate factor score
   * @param {number} weight - Factor weight (0-1)
   * @returns {CustomAlgorithmBuilder}
   */
  addFactor(name, calculator, weight = 0.1) {
    this.factors.set(name, calculator);
    this.weights.set(name, weight);
    return this;
  }
  
  /**
   * Add a risk rule
   * @param {string} name - Rule name
   * @param {Function} condition - Function that returns boolean
   * @param {number} adjustment - Score adjustment if condition true
   * @returns {CustomAlgorithmBuilder}
   */
  addRule(name, condition, adjustment) {
    this.rules.push({ name, condition, adjustment });
    return this;
  }
  
  /**
   * Add a score modifier
   * @param {Function} modifier - Function to modify final score
   * @returns {CustomAlgorithmBuilder}
   */
  addModifier(modifier) {
    this.modifiers.push(modifier);
    return this;
  }
  
  /**
   * Set algorithm name
   * @param {string} name - Algorithm name
   * @returns {CustomAlgorithmBuilder}
   */
  setName(name) {
    this.name = name;
    return this;
  }
  
  /**
   * Build the custom algorithm
   * @returns {CustomAlgorithm} Custom algorithm instance
   */
  build() {
    return new CustomAlgorithm(
      this.name,
      this.factors,
      this.weights,
      this.rules,
      this.modifiers
    );
  }
  
  /**
   * Create algorithm from configuration object
   * @param {Object} config - Algorithm configuration
   * @returns {CustomAlgorithm}
   */
  static fromConfig(config) {
    const builder = new CustomAlgorithmBuilder();
    
    if (config.name) builder.setName(config.name);
    
    // Add factors
    if (config.factors) {
      Object.entries(config.factors).forEach(([name, factorConfig]) => {
        builder.addFactor(
          name,
          factorConfig.calculator,
          factorConfig.weight
        );
      });
    }
    
    // Add rules
    if (config.rules) {
      config.rules.forEach(rule => {
        builder.addRule(
          rule.name,
          rule.condition,
          rule.adjustment
        );
      });
    }
    
    // Add modifiers
    if (config.modifiers) {
      config.modifiers.forEach(modifier => {
        builder.addModifier(modifier);
      });
    }
    
    return builder.build();
  }
}

class CustomAlgorithm extends RiskAlgorithmBase {
  constructor(name, factors, weights, rules, modifiers) {
    super();
    this.algorithmName = name;
    this.customFactors = factors;
    this.customWeights = weights;
    this.customRules = rules;
    this.customModifiers = modifiers;
  }
  
  calculate(employeeData, factors = {}) {
    const factorScores = {};
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    // Calculate custom factor scores
    for (const [name, calculator] of this.customFactors) {
      const weight = this.customWeights.get(name) || 0;
      
      try {
        const score = calculator(employeeData, factors);
        factorScores[name] = score;
        
        totalWeightedScore += score * weight;
        totalWeight += weight;
      } catch (error) {
        console.error(`Error calculating factor ${name}:`, error);
        factorScores[name] = 0;
      }
    }
    
    // Apply base score calculation
    let finalScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 50;
    
    // Apply custom rules
    const triggeredRules = [];
    for (const rule of this.customRules) {
      try {
        if (rule.condition(employeeData, factors)) {
          finalScore += rule.adjustment;
          triggeredRules.push(rule.name);
        }
      } catch (error) {
        console.error(`Error evaluating rule ${rule.name}:`, error);
      }
    }
    
    // Apply custom modifiers
    let modifierLog = [];
    for (const modifier of this.customModifiers) {
      try {
        const result = modifier(finalScore, employeeData, factors);
        if (result && typeof result.score === 'number') {
          finalScore = result.score;
          if (result.description) {
            modifierLog.push(result.description);
          }
        }
      } catch (error) {
        console.error('Error applying modifier:', error);
      }
    }
    
    // Ensure score is in 0-100 range
    finalScore = Math.max(0, Math.min(100, finalScore));
    const riskLevel = this.getRiskLevel(finalScore);
    
    return {
      score: Math.round(finalScore),
      riskLevel,
      algorithm: this.algorithmName,
      factors: factorScores,
      weights: Object.fromEntries(this.customWeights),
      triggeredRules,
      modifierLog,
      timestamp: new Date(),
      isCustom: true
    };
  }
}

// Predefined calculators for common factors
const PredefinedCalculators = {
  // Tenure-based calculator
  tenureRisk: (employeeData) => {
    const hireDate = new Date(employeeData.hireDate);
    const months = (Date.now() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
    
    if (months < 6) return 80;
    if (months < 12) return 60;
    if (months < 24) return 40;
    if (months < 36) return 20;
    return 10;
  },
  
  // Performance-based calculator
  performanceRisk: (employeeData) => {
    const perf = employeeData.performanceScore || 50;
    return 100 - perf; // High performance = low risk
  },
  
  // Market demand calculator
  marketDemandRisk: (employeeData, factors) => {
    const demand = factors.marketDemand || 50;
    const rarity = factors.skillRarity || 'common';
    
    let score = demand;
    
    if (rarity === 'rare') score += 30;
    if (rarity === 'specialized') score += 15;
    
    return Math.min(100, score);
  },
  
  // Engagement calculator
  engagementRisk: (employeeData, factors) => {
    const engagement = factors.engagement || 50;
    const lastPromotion = factors.lastPromotion || 24;
    
    let score = engagement;
    
    if (lastPromotion > 36) score += 25;
    if (lastPromotion > 24) score += 15;
    
    return Math.min(100, score);
  },
  
  // Compensation calculator
  compensationRisk: (employeeData, factors) => {
    const ratio = factors.compensationRatio || 1.0;
    const lastRaise = factors.lastRaise || 24;
    
    let score = 50;
    
    if (ratio < 0.8) score += 35;
    if (ratio < 0.9) score += 20;
    if (lastRaise > 24) score += 20;
    if (lastRaise > 36) score += 15;
    
    return Math.min(100, score);
  }
};

// Predefined rule conditions
const PredefinedRules = {
  // Rule: Active job search
  activeJobSearch: {
    name: 'active_job_search',
    condition: (employeeData, factors) => factors.activeJobSearch === true,
    adjustment: 20
  },
  
  // Rule: Recent resume update
  recentResumeUpdate: {
    name: 'recent_resume_update',
    condition: (employeeData, factors) => factors.resumeUpdateRecent === true,
    adjustment: 15
  },
  
  // Rule: High LinkedIn activity
  highLinkedInActivity: {
    name: 'high_linkedin_activity',
    condition: (employeeData, factors) => factors.linkedinActivity === 'high',
    adjustment: 15
  },
  
  // Rule: Underpaid significantly
  underpaid: {
    name: 'significantly_underpaid',
    condition: (employeeData, factors) => factors.compensationRatio < 0.8,
    adjustment: 25
  },
  
  // Rule: No promotion in 3+ years
  noPromotion: {
    name: 'no_recent_promotion',
    condition: (employeeData, factors) => (factors.lastPromotion || 24) > 36,
    adjustment: 20
  }
};

// Predefined modifiers
const PredefinedModifiers = {
  // Department risk adjustment
  departmentAdjustment: (score, employeeData) => {
    const adjustments = {
      'Engineering': 1.1,
      'Sales': 1.05,
      'Finance': 0.9,
      'HR': 0.95
    };
    
    const multiplier = adjustments[employeeData.department] || 1.0;
    return {
      score: score * multiplier,
      description: `Applied ${employeeData.department} adjustment (x${multiplier})`
    };
  },
  
  // Seniority discount
  seniorityDiscount: (score, employeeData) => {
    const hireDate = new Date(employeeData.hireDate);
    const years = (Date.now() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    
    if (years >= 5) {
      return {
        score: score * 0.8,
        description: 'Applied seniority discount (20% reduction)'
      };
    }
    
    if (years >= 3) {
      return {
        score: score * 0.9,
        description: 'Applied experienced employee discount (10% reduction)'
      };
    }
    
    return { score };
  },
  
  // Critical role protection
  criticalRoleProtection: (score, employeeData, factors) => {
    if (factors.isCriticalRole) {
      return {
        score: score * 1.2,
        description: 'Critical role risk multiplier applied (+20%)'
      };
    }
    return { score };
  }
};

module.exports = {
  CustomAlgorithmBuilder,
  CustomAlgorithm,
  PredefinedCalculators,
  PredefinedRules,
  PredefinedModifiers
};
