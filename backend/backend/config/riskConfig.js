// Risk Scoring Configuration
const RISK_CONFIG = {
  // Score ranges
  SCORE_RANGES: {
    LOW: { min: 0, max: 39 },
    MEDIUM: { min: 40, max: 69 },
    HIGH: { min: 70, max: 100 }
  },
  
  // Weight configurations for different algorithms
  WEIGHTS: {
    DEFAULT: {
      tenure: 0.15,
      performance: 0.25,
      engagement: 0.20,
      market_demand: 0.15,
      compensation: 0.10,
      skills: 0.15
    },
    
    TECH_FOCUSED: {
      skills: 0.30,
      performance: 0.25,
      market_demand: 0.25,
      tenure: 0.10,
      engagement: 0.10
    },
    
    SALES_FOCUSED: {
      performance: 0.40,
      engagement: 0.25,
      tenure: 0.15,
      market_demand: 0.20
    },
    
    LEADERSHIP: {
      tenure: 0.20,
      performance: 0.30,
      engagement: 0.25,
      market_demand: 0.15,
      compensation: 0.10
    }
  },
  
  // Risk level multipliers
  RISK_MULTIPLIERS: {
    LOW: 0.5,
    MEDIUM: 1.0,
    HIGH: 1.5,
    CRITICAL: 2.0
  },
  
  // Algorithm settings
  ALGORITHMS: {
    BASIC: 'basic',
    ADVANCED: 'advanced',
    PREDICTIVE: 'predictive',
    CUSTOM: 'custom'
  },
  
  // Thresholds
  THRESHOLDS: {
    HIGH_RISK: 70,
    MEDIUM_RISK: 40,
    RETENTION_RISK: 60,
    SKILLS_GAP: 30
  }
};

module.exports = RISK_CONFIG;
