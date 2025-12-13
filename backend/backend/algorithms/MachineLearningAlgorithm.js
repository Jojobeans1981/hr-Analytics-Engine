const RiskAlgorithmBase = require('./RiskAlgorithmBase');

class MachineLearningAlgorithm extends RiskAlgorithmBase {
  constructor(config = {}) {
    super(config);
    
    this.model = config.model || null;
    this.features = config.features || this.getDefaultFeatures();
    this.trainingData = config.trainingData || [];
    this.modelVersion = 'ml-1.0';
    
    // Initialize ML model (placeholder for actual ML integration)
    this.initializeModel();
  }
  
  initializeModel() {
    // This is a placeholder for actual ML model initialization
    // In production, you would load a trained model here
    this.model = {
      predict: (features) => {
        // Mock prediction - replace with actual ML model
        const riskProbability = this.mockMLPrediction(features);
        return {
          probability: riskProbability,
          confidence: this.calculateMLConfidence(features)
        };
      },
      version: this.modelVersion
    };
  }
  
  async calculate(employeeData, factors = {}) {
    // Extract features for ML model
    const features = this.extractFeatures(employeeData, factors);
    
    // Get prediction from ML model
    const prediction = await this.model.predict(features);
    
    // Calculate additional scores
    const ruleBasedScore = this.calculateRuleBasedScore(employeeData, factors);
    
    // Combine ML prediction with rule-based score
    const mlWeight = 0.7; // Weight given to ML prediction
    const ruleWeight = 0.3; // Weight given to rule-based score
    
    const combinedScore = (prediction.probability * 100 * mlWeight) + (ruleBasedScore * ruleWeight);
    
    const riskLevel = this.getRiskLevel(combinedScore);
    
    return {
      score: Math.round(combinedScore),
      riskLevel,
      confidence: prediction.confidence,
      factors: {
        mlPrediction: prediction.probability,
        ruleBased: ruleBasedScore,
        combined: combinedScore
      },
      features: features,
      modelVersion: this.modelVersion,
      predictionDetails: {
        probability: prediction.probability,
        featureImportance: this.calculateFeatureImportance(features)
      },
      algorithm: 'machine_learning',
      timestamp: new Date()
    };
  }
  
  extractFeatures(employeeData, factors) {
    // Extract and normalize features for ML model
    const features = {};
    
    // Tenure features
    const hireDate = new Date(employeeData.hireDate);
    const now = new Date();
    const tenureDays = (now - hireDate) / (1000 * 60 * 60 * 24);
    
    features.tenure_days = tenureDays;
    features.tenure_months = tenureDays / 30.44;
    features.tenure_years = tenureDays / 365.25;
    
    // Performance features
    features.performance_score = employeeData.performanceScore || 0;
    features.last_review_score = factors.lastReviewScore || 0;
    features.performance_trend = factors.performanceTrend || 0;
    
    // Compensation features
    features.compensation_ratio = factors.compensationRatio || 1.0;
    features.months_since_raise = factors.monthsSinceRaise || 24;
    features.has_equity = factors.hasEquity ? 1 : 0;
    
    // Market features
    features.market_demand = factors.marketDemand || 50;
    features.skill_rarity = this.encodeSkillRarity(factors.skillRarity);
    features.recruiter_contacts = factors.recruiterContacts || 0;
    
    // Behavioral features
    features.attendance_rate = factors.attendanceRate || 100;
    features.late_arrivals = factors.lateArrivals || 0;
    features.meeting_participation = factors.meetingParticipation || 100;
    
    // Engagement features
    features.engagement_score = factors.engagement || 50;
    features.manager_rating = factors.managerRating || 3;
    features.team_satisfaction = factors.teamSatisfaction || 3;
    
    // Career features
    features.months_since_promotion = factors.monthsSincePromotion || 24;
    features.has_career_path = factors.hasCareerPath ? 1 : 0;
    features.training_hours = factors.trainingHours || 0;
    
    // External features
    features.unemployment_rate = factors.unemploymentRate || 4;
    features.seasonality_month = new Date().getMonth();
    features.economic_index = factors.economicIndex || 100;
    
    // Department encoding
    features.department = this.encodeDepartment(employeeData.department);
    
    return features;
  }
  
  encodeSkillRarity(rarity) {
    const mapping = {
      'common': 0,
      'specialized': 1,
      'rare': 2,
      'critical': 3
    };
    return mapping[rarity] || 0;
  }
  
  encodeDepartment(department) {
    const mapping = {
      'Engineering': 0,
      'Sales': 1,
      'Marketing': 2,
      'Finance': 3,
      'HR': 4,
      'Operations': 5,
      'Product': 6
    };
    return mapping[department] || 0;
  }
  
  mockMLPrediction(features) {
    // Mock ML prediction - replace with actual model inference
    // This is a simplified logistic regression-like calculation
    
    const coefficients = {
      tenure_months: -0.01, // Longer tenure reduces risk
      performance_score: -0.008, // Higher performance reduces risk
      compensation_ratio: -0.3, // Higher comp ratio reduces risk
      market_demand: 0.01, // Higher market demand increases risk
      recruiter_contacts: 0.15, // Recruiter attention increases risk
      months_since_raise: 0.02, // Longer since raise increases risk
      engagement_score: -0.01, // Higher engagement reduces risk
      unemployment_rate: -0.05, // Higher unemployment reduces risk (less opportunities)
    };
    
    const intercept = 0.5;
    
    let logit = intercept;
    
    for (const [feature, value] of Object.entries(features)) {
      if (coefficients[feature]) {
        logit += coefficients[feature] * (value || 0);
      }
    }
    
    // Apply sigmoid function to get probability
    const probability = 1 / (1 + Math.exp(-logit));
    
    return Math.max(0.1, Math.min(0.9, probability));
  }
  
  calculateMLConfidence(features) {
    // Calculate confidence based on feature completeness and variance
    let confidence = 70;
    
    const importantFeatures = [
      'performance_score',
      'compensation_ratio',
      'market_demand',
      'engagement_score',
      'tenure_months'
    ];
    
    let missingCount = 0;
    for (const feature of importantFeatures) {
      if (features[feature] === undefined || features[feature] === null) {
        missingCount++;
      }
    }
    
    confidence -= missingCount * 10;
    
    // Additional confidence based on data quality
    if (features.tenure_months > 12) confidence += 10; // More data for longer tenure
    
    return Math.max(30, Math.min(95, confidence));
  }
  
  calculateRuleBasedScore(employeeData, factors) {
    // Fallback rule-based scoring if ML has low confidence
    const basicAlgorithm = new (require('./BasicRiskAlgorithm'))();
    const basicResult = basicAlgorithm.calculate(employeeData, factors);
    return basicResult.score / 100; // Normalize to 0-1
  }
  
  calculateFeatureImportance(features) {
    // Mock feature importance - in production, get from ML model
    const importance = {
      market_demand: 0.25,
      compensation_ratio: 0.20,
      recruiter_contacts: 0.15,
      months_since_raise: 0.15,
      performance_score: 0.10,
      engagement_score: 0.10,
      tenure_months: 0.05
    };
    
    return importance;
  }
  
  async trainModel(trainingData) {
    // Placeholder for model training
    // In production, this would:
    // 1. Preprocess training data
    // 2. Train model
    // 3. Save model
    // 4. Update model version
    
    console.log('Training ML model with', trainingData.length, 'samples');
    
    // Mock training - replace with actual ML training
    this.trainingData = trainingData;
    this.modelVersion = `ml-${Date.now()}`;
    
    return {
      success: true,
      modelVersion: this.modelVersion,
      accuracy: 0.85, // Mock accuracy
      features: Object.keys(this.features)
    };
  }
  
  getDefaultFeatures() {
    return [
      'tenure_months',
      'performance_score',
      'compensation_ratio',
      'market_demand',
      'recruiter_contacts',
      'months_since_raise',
      'engagement_score',
      'attendance_rate',
      'manager_rating',
      'department'
    ];
  }
}

module.exports = MachineLearningAlgorithm;
