
const { MongoClient } = require('mongodb');
require('dotenv').config();

class BalancedRiskScorer {
    constructor() {
        this.client = new MongoClient(process.env.MONGODB_URI);
    }

    async calculateBalancedRiskScore(employee) {
        let riskScore = 0;
        const riskFactors = [];
        const positiveFactors = [];

        // 1. Tenure Analysis (balanced approach)
        const tenureScore = this.analyzeTenure(employee.tenure);
        riskScore += tenureScore.weight;
        if (tenureScore.factors.length > 0) riskFactors.push(...tenureScore.factors);
        if (tenureScore.positiveFactors.length > 0) positiveFactors.push(...tenureScore.positiveFactors);

        // 2. Performance Analysis
        const performanceScore = this.analyzePerformance(employee.performanceScore);
        riskScore += performanceScore.weight;
        if (performanceScore.factors.length > 0) riskFactors.push(...performanceScore.factors);
        if (performanceScore.positiveFactors.length > 0) positiveFactors.push(...performanceScore.positiveFactors);

        // 3. Skills Analysis (handle missing data gracefully)
        const skillsScore = await this.analyzeSkills(employee);
        riskScore += skillsScore.weight;
        if (skillsScore.factors.length > 0) riskFactors.push(...skillsScore.factors);
        if (skillsScore.positiveFactors.length > 0) positiveFactors.push(...skillsScore.positiveFactors);

        // 4. Engagement Analysis (only if data exists)
        if (employee.engagementScore) {
            const engagementScore = this.analyzeEngagement(employee.engagementScore);
            riskScore += engagementScore.weight;
            if (engagementScore.factors.length > 0) riskFactors.push(...engagementScore.factors);
            if (engagementScore.positiveFactors.length > 0) positiveFactors.push(...engagementScore.positiveFactors);
        }

        // 5. Promotion Analysis (only if data exists)
        if (employee.lastPromotion) {
            const promotionScore = this.analyzePromotion(employee.lastPromotion);
            riskScore += promotionScore.weight;
            if (promotionScore.factors.length > 0) riskFactors.push(...promotionScore.factors);
            if (promotionScore.positiveFactors.length > 0) positiveFactors.push(...promotionScore.positiveFactors);
        }

        // 6. Apply positive factors to reduce risk
        const positiveAdjustment = positiveFactors.length * 0.05;
        riskScore = Math.max(0, riskScore - positiveAdjustment);

        return {
            balancedRiskScore: Math.min(riskScore, 1.0),
            riskLevel: this.categorizeRiskLevel(riskScore),
            riskFactors: riskFactors.slice(0, 3), // Top 3 risk factors
            positiveFactors: positiveFactors.slice(0, 2), // Top 2 positive factors
            confidence: this.calculateConfidence(employee),
            lastUpdated: new Date()
        };
    }

    analyzeTenure(tenure) {
        const factors = [];
        const positiveFactors = [];
        let weight = 0;

        if (!tenure) {
            factors.push('Tenure data missing');
            weight += 0.1;
        } else {
            // Very short tenure (less than 6 months)
            if (tenure < 0.5) {
                factors.push('Very short tenure (< 6 months)');
                weight += 0.2;
            }
            // Short tenure (6-12 months)
            else if (tenure < 1) {
                factors.push('Short tenure (6-12 months)');
                weight += 0.1;
            }
            // Moderate tenure (1-3 years) - neutral
            else if (tenure <= 3) {
                // No additional risk or positive factors
            }
            // Long tenure (3-7 years) - positive
            else if (tenure <= 7) {
                positiveFactors.push('Established tenure (3-7 years)');
                weight -= 0.1;
            }
            // Very long tenure (7+ years) - potential risk of stagnation
            else {
                factors.push('Very long tenure (> 7 years) - potential stagnation risk');
                weight += 0.05;
            }
        }

        return { weight, factors, positiveFactors };
    }

    analyzePerformance(performanceScore) {
        const factors = [];
        const positiveFactors = [];
        let weight = 0;

        if (!performanceScore) {
            factors.push('Performance data missing');
            weight += 0.15;
        } else {
            // Low performance
            if (performanceScore < 2.5) {
                factors.push('Low performance score');
                weight += 0.3;
            }
            // Average performance
            else if (performanceScore < 3.5) {
                // Neutral - no additional weight
            }
            // High performance
            else {
                positiveFactors.push('High performance score');
                weight -= 0.15;
            }

            // Recent performance trends (if available in future enhancements)
            if (employee.performanceTrend === 'declining') {
                factors.push('Declining performance trend');
                weight += 0.1;
            }
        }

        return { weight, factors, positiveFactors };
    }

    async analyzeSkills(employee) {
        const factors = [];
        const positiveFactors = [];
        let weight = 0;

        try {
            await this.client.connect();
            const db = this.client.db(process.env.DB_NAME);
            const skillsCollection = db.collection('employee_skills');

            const employeeSkills = await skillsCollection.findOne({ employeeId: employee.id });
            
            if (!employeeSkills || !employeeSkills.skills || employeeSkills.skills.length === 0) {
                factors.push('Limited skill data available');
                weight += 0.1;
            } else {
                const skills = employeeSkills.skills;
                const criticalSkills = skills.filter(skill => 
                    skill.category === 'critical' && skill.proficiency < 3
                );

                if (criticalSkills.length > 0) {
                    factors.push(`Low proficiency in ${criticalSkills.length} critical skills`);
                    weight += 0.2;
                }

                // Positive: High proficiency in multiple skills
                const highProficiencySkills = skills.filter(skill => skill.proficiency >= 4);
                if (highProficiencySkills.length >= 3) {
                    positiveFactors.push('High proficiency in multiple skills');
                    weight -= 0.1;
                }

                // Positive: Diverse skill set
                const uniqueCategories = new Set(skills.map(skill => skill.category));
                if (uniqueCategories.size >= 4) {
                    positiveFactors.push('Diverse skill set across multiple categories');
                    weight -= 0.05;
                }
            }
        } catch (error) {
            console.error('Error analyzing skills:', error);
            factors.push('Skills assessment unavailable');
            weight += 0.05;
        } finally {
            await this.client.close();
        }

        return { weight, factors, positiveFactors };
    }

    analyzeEngagement(engagementScore) {
        const factors = [];
        const positiveFactors = [];
        let weight = 0;

        // Scale: 1-5, where 1 is very disengaged and 5 is highly engaged
        if (engagementScore < 2.5) {
            factors.push('Low engagement score');
            weight += 0.2;
        } else if (engagementScore >= 4) {
            positiveFactors.push('High engagement score');
            weight -= 0.1;
        }

        return { weight, factors, positiveFactors };
    }

    analyzePromotion(lastPromotion) {
        const factors = [];
        const positiveFactors = [];
        let weight = 0;

        const currentDate = new Date();
        const promotionDate = new Date(lastPromotion);
        const yearsSincePromotion = (currentDate - promotionDate) / (365 * 24 * 60 * 60 * 1000);

        if (yearsSincePromotion > 3) {
            factors.push('No promotion in over 3 years');
            weight += 0.15;
        } else if (yearsSincePromotion < 1) {
            positiveFactors.push('Recent promotion (within 1 year)');
            weight -= 0.1;
        }

        return { weight, factors, positiveFactors };
    }

    categorizeRiskLevel(riskScore) {
        if (riskScore <= 0.2) {
            return 'Low';
        } else if (riskScore <= 0.4) {
            return 'Medium';
        } else if (riskScore <= 0.6) {
            return 'High';
        } else {
            return 'Critical';
        }
    }

    calculateConfidence(employee) {
        let confidence = 1.0;
        let missingDataPoints = 0;
        const totalDataPoints = 5; // tenure, performance, skills, engagement, promotion

        if (!employee.tenure) missingDataPoints++;
        if (!employee.performanceScore) missingDataPoints++;
        if (!employee.skills || employee.skills.length === 0) missingDataPoints++;
        if (!employee.engagementScore) missingDataPoints++;
        if (!employee.lastPromotion) missingDataPoints++;

        confidence -= (missingDataPoints / totalDataPoints) * 0.3;
        return Math.max(0.5, confidence); // Minimum 50% confidence
    }

    // Additional utility method for batch processing
    async calculateBatchRiskScores(employees) {
        const results = [];
        
        for (const employee of employees) {
            try {
                const riskAssessment = await this.calculateBalancedRiskScore(employee);
                results.push({
                    employeeId: employee.id,
                    ...riskAssessment
                });
            } catch (error) {
                console.error(`Error calculating risk for employee ${employee.id}:`, error);
                results.push({
                    employeeId: employee.id,
                    balancedRiskScore: null,
                    riskLevel: 'Unknown',
                    riskFactors: ['Calculation error'],
                    positiveFactors: [],
                    confidence: 0,
                    lastUpdated: new Date()
                });
            }
        }

        return results;
    }
}

module.exports = BalancedRiskScorer;