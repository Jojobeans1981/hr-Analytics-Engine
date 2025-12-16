// src/utils/advancedRiskScorer.ts
import { Employee, EnhancedRiskAssessment } from '../types/risk';

export class AdvancedRiskScorer {
  async calculateEnhancedRiskScore(employee: Employee): Promise<EnhancedRiskAssessment> {
    let riskScore = employee.riskScore || 0;
    const riskFactors: string[] = [...(employee.riskFactors || [])];
    
    // 1. Tenure Risk (shorter tenure = higher risk)
    if (employee.tenure < 2) {
      riskScore += 0.2;
      riskFactors.push('Short tenure (<2 years)');
    }

    // 2. Performance Risk
    if (employee.performanceScore < 3.0) {
      riskScore += 0.3;
      riskFactors.push('Low performance score');
    } else if (employee.performanceScore > 4.5) {
      riskScore += 0.1; // High performers have some flight risk
      riskFactors.push('High performer - market demand');
    }

    // 3. Promotion Stagnation Risk
    if (employee.lastPromotion) {
      const promotionRisk = this.calculatePromotionRisk(employee.lastPromotion);
      riskScore += promotionRisk.score;
      riskFactors.push(...promotionRisk.factors);
    }

    // 4. Engagement Risk
    if (employee.engagementScore < 70) {
      riskScore += 0.15;
      riskFactors.push('Low engagement score');
    }

    // 5. Skills Risk (simplified - you can enhance this)
    const skillsRisk = this.calculateSkillsRisk(employee);
    riskScore += skillsRisk.score;
    riskFactors.push(...skillsRisk.factors);

    return {
      enhancedRiskScore: Math.min(riskScore, 1.0), // Cap at 1.0
      riskLevel: this.categorizeRiskLevel(riskScore),
      riskFactors: riskFactors.slice(0, 5), // Top 5 factors
      lastUpdated: new Date()
    };
  }

  private calculatePromotionRisk(lastPromotionDate: string) {
    const monthsSincePromotion = (new Date().getTime() - new Date(lastPromotionDate).getTime()) / (30 * 24 * 60 * 60 * 1000);
    const factors: string[] = [];
    let score = 0;

    if (monthsSincePromotion > 24) {
      score += 0.25;
      factors.push('No promotion in 2+ years');
    } else if (monthsSincePromotion > 18) {
      score += 0.15;
      factors.push('No promotion in 18+ months');
    }

    return { score, factors };
  }

  private calculateSkillsRisk(employee: Employee) {
    const factors: string[] = [];
    let score = 0;

    // Simplified skills risk calculation
    // You can enhance this with actual skills data from your database
    if (employee.tenure > 36 && employee.performanceScore < 3.5) {
      score += 0.1;
      factors.push('Potential skills stagnation');
    }

    // Add more skills risk logic based on your data
    if (!employee.riskFactors?.some(factor => factor.includes('skills'))) {
      score += 0.05;
      factors.push('Limited skills data');
    }

    return { score, factors };
  }

  private categorizeRiskLevel(score: number): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'MINIMAL' {
    if (score >= 0.7) return 'CRITICAL';
    if (score >= 0.5) return 'HIGH';
    if (score >= 0.3) return 'MEDIUM';
    if (score >= 0.1) return 'LOW';
    return 'MINIMAL';
  }

  async updateAllEmployeeRiskScores(employees: Employee[]): Promise<Employee[]> {
    const updatedEmployees: Employee[] = [];

    for (const employee of employees) {
      const enhancedRisk = await this.calculateEnhancedRiskScore(employee);
      
      updatedEmployees.push({
        ...employee,
        enhancedRiskScore: enhancedRisk.enhancedRiskScore,
        riskLevel: enhancedRisk.riskLevel,
        riskFactors: enhancedRisk.riskFactors,
        lastRiskUpdate: enhancedRisk.lastUpdated,
        confidenceScore: Math.round((1 - enhancedRisk.enhancedRiskScore) * 100)
      });
    }

    return updatedEmployees;
  }
}