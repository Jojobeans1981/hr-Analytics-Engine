// riskMitigationPlanner.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

class RiskMitigationPlanner {
    constructor() {
        this.client = new MongoClient(process.env.MONGODB_URI);
    }

    async generateMitigationPlans() {
        await this.client.connect();
        const db = this.client.db();
        const employeesCollection = db.collection('employees');

        const highRiskEmployees = await employeesCollection.find({ 
            riskLevel: 'HIGH' 
        }).toArray();

        console.log('\n🚀 RISK MITIGATION PLANNER');
        console.log('==========================\n');

        console.log(`🔴 Generating mitigation plans for ${highRiskEmployees.length} high-risk employees:\n`);

        for (const employee of highRiskEmployees) {
            const mitigationPlan = this.createMitigationPlan(employee);
            
            console.log(`👤 ${employee.name} - ${employee.role}`);
            console.log(`   Risk Score: ${employee.balancedRiskScore.toFixed(2)}`);
            console.log(`   Key Risk Factors: ${employee.riskFactors.join(', ')}`);
            
            console.log(`   🎯 MITIGATION PLAN:`);
            mitigationPlan.actions.forEach((action, index) => {
                console.log(`      ${index + 1}. ${action}`);
            });
            
            console.log(`   📅 Timeline: ${mitigationPlan.timeline}`);
            console.log(`   🎯 Success Metrics: ${mitigationPlan.metrics.join(', ')}`);
            console.log('');
        }

        await this.client.close();
    }

    createMitigationPlan(employee) {
        const plan = {
            actions: [],
            timeline: '30-60 days',
            metrics: []
        };

        // Based on risk factors, create specific actions
        if (employee.riskFactors.includes('New employee (<1 year)')) {
            plan.actions.push('Assign experienced mentor for onboarding support');
            plan.actions.push('Schedule weekly check-ins with manager for first 90 days');
            plan.metrics.push('30-day onboarding satisfaction score > 4.0');
        }

        if (employee.riskFactors.includes('Low performance')) {
            plan.actions.push('Create performance improvement plan with clear milestones');
            plan.actions.push('Provide targeted training for skill gaps');
            plan.actions.push('Set weekly performance review meetings');
            plan.metrics.push('Performance score improvement to 3.5+ within 60 days');
        }

        if (employee.riskFactors.includes('Missing modern skills')) {
            plan.actions.push('Enroll in relevant technical training courses');
            plan.actions.push('Assign stretch projects to practice new skills');
            plan.actions.push('Pair with senior team member for knowledge transfer');
            plan.metrics.push('Complete 2 skill certifications within 90 days');
        }

        if (employee.riskFactors.some(f => f.includes('engagement'))) {
            plan.actions.push('Conduct stay interview to understand concerns');
            plan.actions.push('Increase recognition and feedback frequency');
            plan.actions.push('Explore career path development opportunities');
            plan.metrics.push('Engagement score improvement of 20+ points');
        }

        // Add general retention actions
        plan.actions.push('Review compensation against market benchmarks');
        plan.actions.push('Discuss career growth opportunities and timeline');

        return plan;
    }
}

// Run mitigation planner
async function main() {
    const planner = new RiskMitigationPlanner();
    await planner.generateMitigationPlans();
    
    console.log('✅ Mitigation plans generated!');
    console.log('\n📋 NEXT STEPS:');
    console.log('   1. Share these plans with managers');
    console.log('   2. Schedule follow-up reviews in 30 days');
    console.log('   3. Monitor progress through success metrics');
}

main().catch(console.error);