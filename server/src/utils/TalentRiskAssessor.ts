export interface RiskFactors {
  performance: number;
  tenure: number;
  engagement: number;
  compensation: number;
  skills: number;
}

export interface RiskAssessment {
  score: number; // 0-100 percentage
  level: 'low' | 'medium' | 'high'; // ← ADDED THIS LINE
  factors: RiskFactors;
  trend?: 'improving' | 'deteriorating' | 'stable';
}

export class TalentRiskAssessor {
  calculateAdvancedRisk(employee: any): RiskAssessment {
    const factors = {
      performance: this.calculatePerformanceRisk(employee),
      tenure: this.calculateTenureRisk(employee),
      engagement: this.calculateEngagementRisk(employee),
      compensation: this.calculateCompensationRisk(employee),
      skills: this.calculateSkillsRisk(employee)
    };

   
    const weights = {
      performance: 0.35,  
      tenure: 0.15,       
      engagement: 0.25,
      compensation: 0.15,
      skills: 0.1
    };

    const weightedScore = Object.keys(factors).reduce((total, key) => {
      return total + (factors[key as keyof RiskFactors] * weights[key as keyof typeof weights]);
    }, 0);

  
    const rawScore = weightedScore * 100;
    const curvedScore = this.applyRiskCurve(rawScore);
    const finalScore = Math.min(100, Math.max(0, curvedScore));
    const level = this.getRiskLevel(finalScore);

    return {
      score: finalScore,
      level,
      factors,
      trend: this.calculateRiskTrend(employee)
    };
  }

 
  private applyRiskCurve(score: number): number {
    // Power curve to spread middle scores
    const normalized = score / 100;
    const curved = Math.pow(normalized, 1.3) * 100;
    return curved;
  }

  private getRiskLevel(score: number): 'low' | 'medium' | 'high' {
    if (score >= 70) return 'high';
    if (score >= 30) return 'medium';
    return 'low';
  }

  
  private calculatePerformanceRisk(employee: any): number {
    const rating = employee.performanceRating || employee.performance || 3;
    return Math.max(0, (5 - rating) / 4);
  }

  private calculateTenureRisk(employee: any): number {
    const tenureMonths = employee.tenure || employee.monthsWithCompany || 0;
    
    if (tenureMonths < 6) return 0.8;
    if (tenureMonths < 12) return 0.6;
    if (tenureMonths < 24) return 0.3;
    if (tenureMonths < 60) return 0.15;
    return 0.05;
  }

  private calculateEngagementRisk(employee: any): number {
    const engagement = employee.engagementScore || employee.engagement || 0.5;
    return Math.max(0, 1 - engagement);
  }

  private calculateCompensationRisk(employee: any): number {
    const ratio = employee.compRatio || employee.compensationRatio || 1;
    
    if (ratio < 0.7) return 0.9;
    if (ratio < 0.8) return 0.7;
    if (ratio < 0.9) return 0.5;
    if (ratio <= 1.1) return 0.2;
    if (ratio <= 1.3) return 0.1;
    return 0.05;
  }

  private calculateSkillsRisk(employee: any): number {
    const criticalSkills = employee.criticalSkills || [];
    const skillGaps = employee.skillGaps || [];
    
    if (criticalSkills.length === 0) return 0.1;
    
    const gapRatio = skillGaps.length / criticalSkills.length;
    return Math.min(1, gapRatio);
  }

  private calculateRiskTrend(employee: any): 'improving' | 'deteriorating' | 'stable' {
    const recentChange = employee.riskTrend || employee.performanceTrend || 0;
    
    if (recentChange > 0.1) return 'improving';
    if (recentChange < -0.1) return 'deteriorating';
    return 'stable';
  }

  // Batch processing for multiple employees
  assessMultipleEmployees(employees: any[]): Array<{ employee: any; risk: RiskAssessment }> {
    return employees.map(emp => ({
      employee: emp,
      risk: this.calculateAdvancedRisk(emp)
    }));
  }
}