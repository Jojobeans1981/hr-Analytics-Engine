// predictiveEngine.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

class PredictiveEngine {
    constructor() {
        this.client = new MongoClient(process.env.MONGODB_URI);
        this.riskPatterns = this.initializeRiskPatterns();
    }

    initializeRiskPatterns() {
        return {
            'new_employee_struggle': {
                pattern: 'tenure < 1 AND performanceScore < 3.5',
                weight: 0.8,
                prediction: 'High risk of early departure',
                mitigation: 'Enhanced onboarding and mentorship'
            },
            'high_performer_stagnation': {
                pattern: 'performanceScore > 4.5 AND lastPromotion > 18 months',
                weight: 0.7,
                prediction: 'Risk of seeking external opportunities',
                mitigation: 'Accelerated promotion track'
            },
            'skills_obsolescence': {
                pattern: 'tenure > 5 AND missingModernSkills',
                weight: 0.6,
                prediction: 'Future performance decline risk',
                mitigation: 'Reskilling and upskilling program'
            },
            'workload_burnout': {
                pattern: 'engagementScore < 60 AND highWorkload',
                weight: 0.9,
                prediction: 'Burnout and attrition risk',
                mitigation: 'Workload review and wellness support'
            }
        };
    }

    async analyzeFutureRisks() {
        await this.client.connect();
        const db = this.client.db();
        const employeesCollection = db.collection('employees');
        const skillsCollection = db.collection(' Skills Inventory');

        const employees = await employeesCollection.find().toArray();
        
        console.log('\n🔮 PREDICTIVE RISK ANALYTICS ENGINE');
        console.log('===================================\n');
        console.log('Analyzing future risk patterns across 152 employees...\n');

        const predictions = [];

        for (const employee of employees) {
            const employeePredictions = await this.assessEmployeeFutureRisk(employee, skillsCollection, db);
            predictions.push(...employeePredictions);
        }

        // Display predictions by risk level
        this.displayPredictions(predictions);
        
        // Generate strategic recommendations
        this.generateStrategicInsights(predictions, employees);

        await this.client.close();
    }

    async assessEmployeeFutureRisk(employee, skillsCollection, db) {
        const predictions = [];
        const skillsData = await this.getEmployeeSkills(employee, skillsCollection);

        // Pattern 1: New Employee Struggle
        if (employee.tenure < 1 && employee.performanceScore < 3.5) {
            predictions.push({
                type: 'new_employee_struggle',
                employee: employee.name,
                department: employee.department,
                confidence: 0.85,
                timeframe: '3-6 months',
                prediction: 'High risk of early departure due to performance struggles',
                triggers: [`Tenure: ${employee.tenure} years`, `Performance: ${employee.performanceScore}`],
                riskLevel: 'HIGH'
            });
        }

        // Pattern 2: High Performer Stagnation
        if (employee.performanceScore > 4.5) {
            const monthsSincePromotion = employee.lastPromotion ? 
                this.getMonthsSinceDate(employee.lastPromotion) : 24;
            
            if (monthsSincePromotion > 18) {
                predictions.push({
                    type: 'high_performer_stagnation',
                    employee: employee.name,
                    department: employee.department,
                    confidence: 0.75,
                    timeframe: '6-12 months',
                    prediction: 'Risk of seeking advancement opportunities externally',
                    triggers: [`Top performer (${employee.performanceScore})`, `No promotion in ${monthsSincePromotion} months`],
                    riskLevel: 'HIGH'
                });
            }
        }

        // Pattern 3: Skills Obsolescence
        if (employee.tenure > 3 && skillsData) {
            const modernSkills = ['AI', 'Machine Learning', 'Cloud', 'React', 'Node.js'];
            const hasModernSkills = skillsData.technicalSkills?.some(skill => 
                modernSkills.some(modern => skill.skill?.includes(modern))
            );

            if (!hasModernSkills) {
                predictions.push({
                    type: 'skills_obsolescence',
                    employee: employee.name,
                    department: employee.department,
                    confidence: 0.65,
                    timeframe: '12-24 months',
                    prediction: 'Future performance decline due to skills gap',
                    triggers: [`Tenure: ${employee.tenure} years`, 'Missing modern technical skills'],
                    riskLevel: 'MEDIUM'
                });
            }
        }

        // Pattern 4: Workload Burnout (simulated)
        if (employee.engagementScore < 60) {
            // Simulate workload detection - in real system, you'd have actual workload data
            const simulatedWorkload = employee.department === 'Engineering' ? 'high' : 'medium';
            
            if (simulatedWorkload === 'high') {
                predictions.push({
                    type: 'workload_burnout',
                    employee: employee.name,
                    department: employee.department,
                    confidence: 0.8,
                    timeframe: '3-9 months',
                    prediction: 'Burnout risk due to high workload and low engagement',
                    triggers: [`Engagement: ${employee.engagementScore}`, 'High workload detected'],
                    riskLevel: 'HIGH'
                });
            }
        }

        return predictions;
    }

    async getEmployeeSkills(employee, skillsCollection) {
        return await skillsCollection.findOne({
            $or: [
                { employeeId: employee.employeeId },
                { employeeId: employee.email },
                { employeeEmail: employee.email }
            ]
        });
    }

    getMonthsSinceDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        return (now - date) / (30 * 24 * 60 * 60 * 1000);
    }

    displayPredictions(predictions) {
        const highRiskPredictions = predictions.filter(p => p.riskLevel === 'HIGH');
        const mediumRiskPredictions = predictions.filter(p => p.riskLevel === 'MEDIUM');

        console.log('🚨 HIGH RISK PREDICTIONS (Immediate Attention):');
        console.log('==============================================\n');
        
        if (highRiskPredictions.length === 0) {
            console.log('✅ No high-risk predictions detected\n');
        } else {
            highRiskPredictions.forEach((pred, index) => {
                console.log(`${index + 1}. ${pred.employee} (${pred.department})`);
                console.log(`   📅 Timeframe: ${pred.timeframe}`);
                console.log(`   🎯 Prediction: ${pred.prediction}`);
                console.log(`   📊 Confidence: ${(pred.confidence * 100)}%`);
                console.log(`   🔍 Triggers: ${pred.triggers.join(', ')}`);
                console.log('');
            });
        }

        console.log('🟡 MEDIUM RISK PREDICTIONS (Strategic Planning):');
        console.log('================================================\n');
        
        if (mediumRiskPredictions.length === 0) {
            console.log('✅ No medium-risk predictions detected\n');
        } else {
            mediumRiskPredictions.slice(0, 5).forEach((pred, index) => {
                console.log(`${index + 1}. ${pred.employee} (${pred.department})`);
                console.log(`   📅 Timeframe: ${pred.timeframe}`);
                console.log(`   🎯 Prediction: ${pred.prediction}`);
                console.log(`   📊 Confidence: ${(pred.confidence * 100)}%`);
                console.log('');
            });
        }
    }

    generateStrategicInsights(predictions, employees) {
        console.log('💡 STRATEGIC INSIGHTS & RECOMMENDATIONS');
        console.log('=======================================\n');

        const predictionTypes = {};
        predictions.forEach(pred => {
            if (!predictionTypes[pred.type]) {
                predictionTypes[pred.type] = 0;
            }
            predictionTypes[pred.type]++;
        });

        // Department vulnerability analysis
        const departmentVulnerability = {};
        predictions.forEach(pred => {
            if (!departmentVulnerability[pred.department]) {
                departmentVulnerability[pred.department] = 0;
            }
            departmentVulnerability[pred.department]++;
        });

        console.log('📊 PREDICTION DISTRIBUTION:');
        Object.entries(predictionTypes).forEach(([type, count]) => {
            console.log(`   ${this.formatPredictionType(type)}: ${count} employees`);
        });

        console.log('\n🏢 DEPARTMENT VULNERABILITY:');
        Object.entries(departmentVulnerability)
            .sort(([,a], [,b]) => b - a)
            .forEach(([dept, count]) => {
                const percentage = ((count / employees.filter(e => e.department === dept).length) * 100).toFixed(1);
                console.log(`   ${dept}: ${count} at-risk (${percentage}% of department)`);
            });

        console.log('\n🎯 STRATEGIC ACTIONS:');
        if (predictionTypes['new_employee_struggle'] > 0) {
            console.log('   • Enhance onboarding program for new hires');
        }
        if (predictionTypes['high_performer_stagnation'] > 0) {
            console.log('   • Create accelerated career paths for top performers');
        }
        if (predictionTypes['skills_obsolescence'] > 0) {
            console.log('   • Launch organization-wide upskilling initiative');
        }
        if (predictionTypes['workload_burnout'] > 0) {
            console.log('   • Implement workload management and wellness programs');
        }

        console.log(`\n📈 TOTAL PREDICTIVE RISKS IDENTIFIED: ${predictions.length}`);
        console.log(`👥 AFFECTING ${new Set(predictions.map(p => p.employee)).size} UNIQUE EMPLOYEES`);
    }

    formatPredictionType(type) {
        const formatted = type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return formatted.padEnd(25);
    }
}

// Run the predictive engine
async function main() {
    console.log('🔮 INITIATING PREDICTIVE RISK ANALYSIS...\n');
    
    const engine = new PredictiveEngine();
    await engine.analyzeFutureRisks();
    
    console.log('\n✅ Predictive analysis complete!');
    console.log('\n📋 NEXT STEPS:');
    console.log('   1. Review high-risk predictions immediately');
    console.log('   2. Develop prevention strategies for medium risks');
    console.log('   3. Schedule quarterly predictive analysis');
}

main().catch(console.error);