// fixedRiskScorer.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

class FixedRiskScorer {
    constructor() {
        this.client = new MongoClient(process.env.MONGODB_URI);
    }

    async calculateBalancedRiskScore(employee) {
        console.log(`  Calculating risk for: ${employee.name}`);
        
        let riskScore = 0;
        const riskFactors = [];
        const positiveFactors = [];

        // 1. Tenure Analysis
        if (employee.tenure < 1) {
            riskScore += 0.3;
            riskFactors.push('New employee (<1 year)');
        } else if (employee.tenure < 2) {
            riskScore += 0.15;
            riskFactors.push('Recent hire (1-2 years)');
        } else if (employee.tenure > 5) {
            positiveFactors.push('Long-tenured (5+ years)');
            riskScore -= 0.1;
        }

        // 2. Performance Analysis
        if (employee.performanceScore < 3.0) {
            riskScore += 0.3;
            riskFactors.push('Low performance');
        } else if (employee.performanceScore >= 4.5) {
            riskScore += 0.1; // High performers have some flight risk
            positiveFactors.push('Top performer');
        }

        // 3. Skills Analysis
        const skillsData = await this.getSkillsData(employee);
        if (skillsData) {
            positiveFactors.push('Skills assessed');
            
            const techSkills = skillsData.technicalSkills || [];
            if (techSkills.length < 3) {
                riskScore += 0.1;
                riskFactors.push('Limited technical skills');
            }
            
            // Check for modern skills
            const modernSkills = ['Cloud', 'AI', 'Machine Learning', 'React', 'Node.js'];
            const hasModernSkills = techSkills.some(skillObj => 
                modernSkills.some(modern => skillObj.skill?.includes(modern))
            );
            
            if (!hasModernSkills) {
                riskScore += 0.1;
                riskFactors.push('Missing modern skills');
            } else {
                positiveFactors.push('Has modern skills');
            }
        } else {
            riskScore += 0.05;
            riskFactors.push('Skills data missing');
        }

        // 4. Engagement Analysis
        if (employee.engagementScore && employee.engagementScore < 70) {
            riskScore += 0.15;
            riskFactors.push('Low engagement');
        } else if (employee.engagementScore >= 85) {
            positiveFactors.push('Highly engaged');
        }

        // 5. Promotion Analysis
        if (employee.lastPromotion) {
            const monthsSincePromotion = this.getMonthsSincePromotion(employee.lastPromotion);
            if (monthsSincePromotion > 24) {
                riskScore += 0.2;
                riskFactors.push('No promotion in 2+ years');
            } else if (monthsSincePromotion < 12) {
                positiveFactors.push('Recently promoted');
            }
        }

        // Apply positive factors adjustment
        const positiveAdjustment = positiveFactors.length * 0.05;
        riskScore = Math.max(0, riskScore - positiveAdjustment);

        return {
            balancedRiskScore: Math.min(riskScore, 1.0),
            riskLevel: this.categorizeRiskLevel(riskScore),
            riskFactors: riskFactors.slice(0, 3),
            positiveFactors: positiveFactors.slice(0, 2),
            confidence: this.calculateConfidence(employee),
            lastUpdated: new Date()
        };
    }

    async getSkillsData(employee) {
        const db = this.client.db();
        const skillsCollection = db.collection(' Skills Inventory');
        
        // Try multiple ways to find skills data
        const skillsData = await skillsCollection.findOne({
            $or: [
                { employeeId: employee.employeeId },
                { employeeId: employee.email },
                { employeeEmail: employee.email },
                { employeeName: employee.name }
            ]
        });
        
        return skillsData;
    }

    getMonthsSincePromotion(promotionDate) {
        const promotion = new Date(promotionDate);
        const now = new Date();
        return (now - promotion) / (30 * 24 * 60 * 60 * 1000);
    }

    calculateConfidence(employee) {
        let confidence = 100;
        if (!employee.performanceScore) confidence -= 20;
        if (!employee.tenure) confidence -= 20;
        if (!employee.engagementScore) confidence -= 15;
        return Math.max(confidence, 50);
    }

    categorizeRiskLevel(score) {
        if (score >= 0.6) return 'HIGH';
        if (score >= 0.4) return 'MEDIUM';
        if (score >= 0.2) return 'LOW';
        return 'MINIMAL';
    }

    async updateAllRiskScores() {
        await this.client.connect();
        const db = this.client.db();
        const employeesCollection = db.collection('employees');
        
        const employees = await employeesCollection.find().toArray();
        console.log(`🔄 Processing ${employees.length} employees...\n`);

        let processed = 0;
        const riskDistribution = { HIGH: 0, MEDIUM: 0, LOW: 0, MINIMAL: 0 };

        for (const employee of employees) {
            try {
                const balancedRisk = await this.calculateBalancedRiskScore(employee);
                
                await employeesCollection.updateOne(
                    { _id: employee._id },
                    { 
                        $set: {
                            balancedRiskScore: balancedRisk.balancedRiskScore,
                            riskLevel: balancedRisk.riskLevel,
                            riskFactors: balancedRisk.riskFactors,
                            positiveFactors: balancedRisk.positiveFactors,
                            confidenceScore: balancedRisk.confidence,
                            lastRiskUpdate: balancedRisk.lastUpdated
                        }
                    }
                );
                
                riskDistribution[balancedRisk.riskLevel]++;
                processed++;
                
                // Show progress for first few and high-risk employees
                if (processed <= 5 || balancedRisk.riskLevel === 'HIGH') {
                    console.log(`✅ ${employee.name}: ${balancedRisk.riskLevel} (${balancedRisk.balancedRiskScore.toFixed(2)})`);
                    if (balancedRisk.riskFactors.length > 0) {
                        console.log(`   Risk Factors: ${balancedRisk.riskFactors.join(', ')}`);
                    }
                    if (balancedRisk.positiveFactors.length > 0) {
                        console.log(`   Strengths: ${balancedRisk.positiveFactors.join(', ')}`);
                    }
                }
                
                // Show progress every 20 employees
                if (processed % 20 === 0) {
                    console.log(`📊 Progress: ${processed}/${employees.length} employees processed...`);
                }
                
            } catch (error) {
                console.log(`❌ Error with ${employee.name}:`, error.message);
            }
        }

        console.log(`\n🎉 PROCESSING COMPLETE!`);
        console.log(`📈 Updated ${processed} employees with balanced risk scores\n`);
        
        // Show final distribution
        console.log('📊 FINAL RISK DISTRIBUTION:');
        Object.entries(riskDistribution).forEach(([level, count]) => {
            const percentage = ((count / employees.length) * 100).toFixed(1);
            console.log(`   ${level}: ${count} employees (${percentage}%)`);
        });

        await this.client.close();
    }
}

// Run the fixed risk scorer
async function main() {
    console.log('🚀 STARTING FIXED RISK SCORER...\n');
    console.log('This version includes better error handling and progress tracking.\n');
    
    const scorer = new FixedRiskScorer();
    await scorer.updateAllRiskScores();
    
    console.log('\n✅ Fixed risk scoring complete!');
    console.log('Run: node balancedDashboard.js');
}

main().catch(console.error);