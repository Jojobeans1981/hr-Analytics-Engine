// advancedRiskScorer.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

class AdvancedRiskScorer {
    constructor() {
        this.client = new MongoClient(process.env.MONGODB_URI);
    }

    async calculateEnhancedRiskScore(employee) {
        let riskScore = employee.riskScore || 0;
        const riskFactors = [];
        
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

        // 3. Skills Stagnation Risk
        const skillsRisk = await this.calculateSkillsRisk(employee);
        riskScore += skillsRisk.score;
        if (skillsRisk.factors.length > 0) {
            riskFactors.push(...skillsRisk.factors);
        }

        // 4. Promotion Stagnation Risk
        if (employee.lastPromotion) {
            const promotionRisk = this.calculatePromotionRisk(employee.lastPromotion);
            riskScore += promotionRisk.score;
            if (promotionRisk.factors.length > 0) {
                riskFactors.push(...promotionRisk.factors);
            }
        }

        // 5. Engagement Risk
        if (employee.engagementScore < 70) {
            riskScore += 0.15;
            riskFactors.push('Low engagement score');
        }

        return {
            enhancedRiskScore: Math.min(riskScore, 1.0), // Cap at 1.0
            riskLevel: this.categorizeRiskLevel(riskScore),
            riskFactors: riskFactors.slice(0, 5), // Top 5 factors
            lastUpdated: new Date()
        };
    }

    calculatePromotionRisk(lastPromotionDate) {
        const monthsSincePromotion = (new Date() - new Date(lastPromotionDate)) / (30 * 24 * 60 * 60 * 1000);
        const factors = [];
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

    async calculateSkillsRisk(employee) {
        const db = this.client.db();
        const skillsCollection = db.collection(' Skills Inventory');
        
        const skillsData = await skillsCollection.findOne({ employeeId: employee.employeeId });
        const factors = [];
        let score = 0;

        if (skillsData) {
            const technicalSkills = skillsData.technicalSkills || [];
            const softSkills = skillsData.softSkills || [];
            
            // Check for legacy skills
            const legacySkills = ['Java', 'PHP', 'jQuery'].filter(skill => 
                technicalSkills.some(s => s.skill === skill)
            );
            
            if (legacySkills.length > 0) {
                score += 0.1;
                factors.push(`Legacy skills: ${legacySkills.join(', ')}`);
            }

            // Check skill diversity
            if (technicalSkills.length < 3) {
                score += 0.1;
                factors.push('Limited technical skill diversity');
            }
        } else {
            score += 0.05;
            factors.push('No skills inventory data');
        }

        return { score, factors };
    }

    categorizeRiskLevel(score) {
        if (score >= 0.7) return 'CRITICAL';
        if (score >= 0.5) return 'HIGH';
        if (score >= 0.3) return 'MEDIUM';
        if (score >= 0.1) return 'LOW';
        return 'MINIMAL';
    }

    async updateAllEmployeeRiskScores() {
        await this.client.connect();
        const db = this.client.db();
        const employeesCollection = db.collection('employees');
        
        const employees = await employeesCollection.find().toArray();
        let updatedCount = 0;

        for (const employee of employees) {
            const enhancedRisk = await this.calculateEnhancedRiskScore(employee);
            
            await employeesCollection.updateOne(
                { _id: employee._id },
                { 
                    $set: {
                        enhancedRiskScore: enhancedRisk.enhancedRiskScore,
                        riskLevel: enhancedRisk.riskLevel,
                        riskFactors: enhancedRisk.riskFactors,
                        lastRiskUpdate: enhancedRisk.lastUpdated
                    }
                }
            );
            
            updatedCount++;
            console.log(`✅ Updated ${employee.name}: ${enhancedRisk.riskLevel} (${enhancedRisk.enhancedRiskScore})`);
        }

        console.log(`\n🎉 Updated ${updatedCount} employees with enhanced risk scores`);
        await this.client.close();
    }
}

// Run the enhanced risk scoring
async function main() {
    const scorer = new AdvancedRiskScorer();
    await scorer.updateAllEmployeeRiskScores();
}

main().catch(console.error);