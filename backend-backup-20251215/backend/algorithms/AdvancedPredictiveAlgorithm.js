const RiskAlgorithmBase = require('./RiskAlgorithmBase');

class AdvancedPredictiveAlgorithm extends RiskAlgorithmBase {
  constructor(config = {}) {
    super({
      weights: {
        behavioral: 0.25,
        financial: 0.20,
        market: 0.25,
        organizational: 0.15,
        predictive: 0.15
      },
      ...config
    });
    
    this.patterns = config.patterns || {};
    this.historicalData = config.historicalData || [];
  }
  
  calculate(employeeData, factors = {}) {
    const validation = this.validateData(employeeData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    // Calculate multiple dimension scores
    const behavioralScore = this.calculateBehavioralScore(employeeData, factors);
    const financialScore = this.calculateFinancialScore(employeeData, factors);
    const marketScore = this.calculateMarketIntelligenceScore(employeeData, factors);
    const orgScore = this.calculateOrganizationalScore(employeeData, factors);
    const predictiveScore = this.calculatePredictiveScore(employeeData, factors);
    
    // Calculate trend if historical data available
    const trendScore = this.calculateTrendScore(employeeData);
    
    // Apply weights
    const weightedScore = 
      this.applyWeight(behavioralScore, this.weights.behavioral) +
      this.applyWeight(financialScore, this.weights.financial) +
      this.applyWeight(marketScore, this.weights.market) +
      this.applyWeight(orgScore, this.weights.organizational) +
      this.applyWeight(predictiveScore, this.weights.predictive);
    
    let finalScore = this.normalizeScore(weightedScore);
    
    // Apply trend adjustment
    if (trendScore) {
      finalScore = finalScore * (1 + trendScore);
    }
    
    // Apply department-specific adjustments
    finalScore = this.applyDepartmentAdjustment(finalScore, employeeData.department);
    
    // Apply critical risk flags
    if (this.hasCriticalRiskFlags(employeeData, factors)) {
      finalScore = Math.min(100, finalScore + 20);
    }
    
    const riskLevel = this.getRiskLevel(finalScore);
    
    return {
      score: Math.round(finalScore),
      riskLevel,
      confidence: this.calculateConfidence(employeeData, factors),
      factors: {
        behavioral: behavioralScore,
        financial: financialScore,
        market: marketScore,
        organizational: orgScore,
        predictive: predictiveScore,
        trend: trendScore || 0
      },
      flags: this.identifyRiskFlags(employeeData, factors),
      recommendations: this.generateRecommendations(finalScore, employeeData, factors),
      algorithm: 'advanced_predictive',
      timestamp: new Date(),
      modelVersion: '2.0.0'
    };
  }
  
  calculateBehavioralScore(employeeData, factors) {
    let score = 50;
    
    // Attendance patterns
    const attendanceRate = factors.attendanceRate || 100;
    if (attendanceRate < 90) score += 20;
    if (attendanceRate < 95) score += 10;
    
    // Punctuality
    const lateArrivals = factors.lateArrivals || 0;
    if (lateArrivals > 5) score += 15;
    if (lateArrivals > 10) score += 10;
    
    // Meeting participation
    const meetingParticipation = factors.meetingParticipation || 100;
    if (meetingParticipation < 80) score += 10;
    
    // Peer feedback
    const peerRating = factors.peerRating || 3;
    if (peerRating < 2.5) score += 15;
    
    return Math.min(100, score);
  }
  
  calculateFinancialScore(employeeData, factors) {
    let score = 50;
    
    // Compensation competitiveness
    const compRatio = factors.compensationRatio || 1.0;
    if (compRatio < 0.85) score += 25;
    if (compRatio < 0.95) score += 10;
    
    // Bonus history
    const hasBonus = factors.receivedBonus || false;
    if (!hasBonus) score += 5;
    
    // Equity/stocks
    const hasEquity = factors.hasEquity || false;
    if (!hasEquity) score += 10;
    
    // Last raise timeframe
    const monthsSinceRaise = factors.monthsSinceRaise || 24;
    if (monthsSinceRaise > 24) score += 20;
    if (monthsSinceRaise > 18) score += 10;
    
    return Math.min(100, score);
  }
  
  calculateMarketIntelligenceScore(employeeData, factors) {
    let score = factors.marketDemand || 50;
    
    // LinkedIn profile activity
    const linkedinActivity = factors.linkedinActivity || 'low';
    if (linkedinActivity === 'high') score += 20;
    if (linkedinActivity === 'medium') score += 10;
    
    // Skill rarity in market
    const skillRarity = factors.skillRarity || 'common';
    if (skillRarity === 'rare') score += 25;
    if (skillRarity === 'specialized') score += 15;
    
    // Known recruiter contacts
    const recruiterContacts = factors.recruiterContacts || 0;
    if (recruiterContacts > 0) score += 15;
    if (recruiterContacts > 2) score += 10;
    
    // Industry events participation
    const industryEvents = factors.industryEvents || 0;
    if (industryEvents > 3) score += 10;
    
    return Math.min(100, score);
  }
  
  calculateOrganizationalScore(employeeData, factors) {
    let score = 50;
    
    // Role clarity
    const roleClarity = factors.roleClarity || 3;
    if (roleClarity < 2.5) score += 15;
    
    // Career progression path
    const hasCareerPath = factors.hasCareerPath || false;
    if (!hasCareerPath) score += 10;
    
    // Manager relationship
    const managerRating = factors.managerRating || 3;
    if (managerRating < 2.5) score += 20;
    
    // Team dynamics
    const teamSatisfaction = factors.teamSatisfaction || 3;
    if (teamSatisfaction < 2.5) score += 10;
    
    // Remote work flexibility
    const remoteFlexibility = factors.remoteFlexibility || false;
    if (!remoteFlexibility && factors.desiresRemote) score += 15;
    
    return Math.min(100, score);
  }
  
  calculatePredictiveScore(employeeData, factors) {
    let score = 50;
    
    // Similar employee patterns
    const similarAttrition = factors.similarAttritionRate || 10;
    score += similarAttrition;
    
    // Department turnover
    const deptTurnover = factors.departmentTurnover || 10;
    score += deptTurnover;
    
    // Seasonality factor
    const month = new Date().getMonth();
    const isPeakHiringSeason = [0, 1, 5, 6].includes(month); // Jan, Feb, Jun, Jul
    if (isPeakHiringSeason) score += 10;
    
    // Economic indicators
    const unemploymentRate = factors.unemploymentRate || 4;
    if (unemploymentRate < 4) score += 15; // Low unemployment = more opportunities
    
    return Math.min(100, score);
  }
  
  calculateTrendScore(employeeData) {
    // This would typically use historical data
    // For now, return a simple trend calculation
    const historicalScores = factors.historicalScores || [];
    if (historicalScores.length < 2) return 0;
    
    const recentScores = historicalScores.slice(-3);
    const trend = (recentScores[recentScores.length - 1] - recentScores[0]) / recentScores[0];
    
    return trend; // Positive trend increases risk
  }
  
  calculateConfidence(employeeData, factors) {
    // Calculate confidence level based on data completeness
    let confidence = 70; // Base confidence
    
    const dataPoints = [
      employeeData.performanceScore !== undefined,
      factors.marketDemand !== undefined,
      factors.compensationRatio !== undefined,
      factors.engagement !== undefined,
      factors.lastPromotion !== undefined
    ];
    
    const completeDataPoints = dataPoints.filter(Boolean).length;
    confidence += (completeDataPoints / dataPoints.length) * 30;
    
    return Math.min(100, Math.round(confidence));
  }
  
  hasCriticalRiskFlags(employeeData, factors) {
    const flags = [];
    
    // Critical flags that immediately increase risk
    if (factors.activeJobSearch) flags.push('active_job_search');
    if (factors.resumeUpdateRecent) flags.push('recent_resume_update');
    if (factors.interviewedRecently) flags.push('recent_interviews');
    if (factors.networkingEvents > 3) flags.push('high_networking');
    if (factors.skillCertifications === 0) flags.push('no_recent_certifications');
    
    return flags.length > 0;
  }
  
  identifyRiskFlags(employeeData, factors) {
    const flags = [];
    
    // Behavioral flags
    if (factors.attendanceRate < 90) flags.push('low_attendance');
    if (factors.lateArrivals > 5) flags.push('punctuality_issues');
    
    // Financial flags
    if (factors.compensationRatio < 0.85) flags.push('underpaid');
    if (factors.monthsSinceRaise > 24) flags.push('no_recent_raise');
    
    // Market flags
    if (factors.linkedinActivity === 'high') flags.push('active_linkedin');
    if (factors.recruiterContacts > 0) flags.push('recruiter_attention');
    if (factors.skillRarity === 'rare') flags.push('high_demand_skills');
    
    // Organizational flags
    if (factors.roleClarity < 2.5) flags.push('unclear_role');
    if (factors.managerRating < 2.5) flags.push('manager_issues');
    if (!factors.hasCareerPath) flags.push('no_career_path');
    
    return flags;
  }
  
  generateRecommendations(score, employeeData, factors) {
    const recommendations = [];
    
    if (score >= 70) {
      recommendations.push('Immediate retention strategy required');
      recommendations.push('Schedule urgent manager check-in');
      recommendations.push('Review compensation package');
    } else if (score >= 50) {
      recommendations.push('Schedule career development discussion');
      recommendations.push('Consider skill development opportunities');
      recommendations.push('Review role clarity and expectations');
    }
    
    // Specific recommendations based on flags
    if (factors.compensationRatio < 0.9) {
      recommendations.push('Benchmark compensation against market');
    }
    
    if (factors.monthsSinceRaise > 18) {
      recommendations.push('Review promotion/raise timeline');
    }
    
    if (factors.roleClarity < 3) {
      recommendations.push('Clarify role expectations and responsibilities');
    }
    
    if (factors.managerRating < 3) {
      recommendations.push('Address manager-employee relationship');
    }
    
    return recommendations;
  }
  
  applyDepartmentAdjustment(score, department) {
    const adjustments = {
      'Engineering': 1.1, // 10% higher risk (competitive market)
      'Sales': 1.05, // 5% higher risk
      'Marketing': 1.0,
      'Finance': 0.9, // 10% lower risk
      'HR': 0.95, // 5% lower risk
      'Operations': 1.0
    };
    
    const multiplier = adjustments[department] || 1.0;
    return score * multiplier;
  }
}

module.exports = AdvancedPredictiveAlgorithm;
