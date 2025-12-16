// crisisResponse.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

class CrisisResponse {
    constructor() {
        this.client = new MongoClient(process.env.MONGODB_URI);
    }

    async generateCrisisResponsePlan() {
        await this.client.connect();
        const db = this.client.db();
        const employeesCollection = db.collection('employees');

        const employees = await employeesCollection.find().toArray();
        
        console.log('\n🚨 CRISIS RESPONSE PLAN - ENGINEERING DEPARTMENT');
        console.log('================================================\n');

        // Focus on Engineering department
        const engineeringEmployees = employees.filter(emp => emp.department === 'Engineering');
        const highRiskEngineers = engineeringEmployees.filter(emp => 
            emp.riskLevel === 'HIGH' || (emp.balancedRiskScore || 0) > 0.6
        );

        console.log(`🔴 ENGINEERING CRISIS OVERVIEW:`);
        console.log(`   • Total Engineers: ${engineeringEmployees.length}`);
        console.log(`   • High/Medium Risk: ${highRiskEngineers.length} (${((highRiskEngineers.length/engineeringEmployees.length)*100).toFixed(1)}%)`);
        console.log(`   • Burnout Risk: ${engineeringEmployees.filter(emp => emp.engagementScore < 70).length} engineers`);
        console.log(`   • Top Performers at Risk: ${engineeringEmployees.filter(emp => emp.performanceScore > 4.5).length}\n`);

        console.log('🎯 IMMEDIATE ACTIONS (Next 7 Days):');
        console.log('─────────────────────────────────');
        
        // Action 1: Address Burnout
        console.log('1. 🆘 BURNOUT PREVENTION:');
        const burnoutRisk = engineeringEmployees.filter(emp => emp.engagementScore < 70);
        burnoutRisk.slice(0, 5).forEach(emp => {
            console.log(`   • ${emp.name}: Reduce workload, schedule wellness check`);
        });

        // Action 2: Retain Top Performers
        console.log('\n2. 🌟 TOP PERFORMER RETENTION:');
        const topPerformers = engineeringEmployees.filter(emp => emp.performanceScore > 4.5);
        topPerformers.forEach(emp => {
            const monthsSincePromotion = emp.lastPromotion ? 
                Math.floor((new Date() - new Date(emp.lastPromotion)) / (30 * 24 * 60 * 60 * 1000)) : 'N/A';
            console.log(`   • ${emp.name}: Career path discussion (${monthsSincePromotion} months since promotion)`);
        });

        // Action 3: New Hire Support
        console.log('\n3. 🎓 NEW HIRE SUPPORT:');
        const strugglingNewHires = engineeringEmployees.filter(emp => 
            emp.tenure < 1 && emp.performanceScore < 3.5
        );
        strugglingNewHires.forEach(emp => {
            console.log(`   • ${emp.name}: Assign mentor, weekly check-ins`);
        });

        console.log('\n📊 DEPARTMENT-WIDE SOLUTIONS:');
        console.log('────────────────────────────');
        console.log('1. 🏃‍♂️ WORKLOAD MANAGEMENT:');
        console.log('   • Implement workload transparency dashboard');
        console.log('   • Hire 2-3 additional engineers immediately');
        console.log('   • Establish sustainable pace guidelines');

        console.log('\n2. 💰 COMPENSATION & ADVANCEMENT:');
        console.log('   • Accelerated promotion cycle for top performers');
        console.log('   • Market salary adjustment review');
        console.log('   • Clear technical career ladder');

        console.log('\n3. 🎪 SKILLS DEVELOPMENT:');
        console.log('   • Modern tech stack training program');
        console.log('   • Innovation time (20% time)');
        console.log('   • Conference and learning budget');

        // Generate manager action items
        console.log('\n👨‍💼 MANAGER ACTION ITEMS:');
        console.log('──────────────────────');
        console.log('This Week:');
        console.log('• Conduct 1:1s with all high-risk engineers');
        console.log('• Review and redistribute workload');
        console.log('• Schedule career development conversations');

        console.log('\nThis Month:');
        console.log('• Implement engineering wellness program');
        console.log('• Launch skills development initiative');
        console.log('• Review and update compensation structure');

        console.log('\nQuarterly:');
        console.log('• Department health assessment');
        console.log('• Retention strategy review');
        console.log('• Workload capacity planning');

        await this.client.close();
    }

    async generateIndividualRescuePlans() {
        await this.client.connect();
        const db = this.client.db();
        const employeesCollection = db.collection('employees');

        const criticalCases = await employeesCollection.find({
            department: 'Engineering',
            $or: [
                { balancedRiskScore: { $gte: 0.7 } },
                { engagementScore: { $lt: 50 } },
                { performanceScore: { $lt: 3.0 } }
            ]
        }).toArray();

        console.log('\n🆘 INDIVIDUAL RESCUE PLANS - CRITICAL CASES:');
        console.log('============================================\n');

        criticalCases.forEach((emp, index) => {
            console.log(`${index + 1}. ${emp.name} - ${emp.role}`);
            console.log(`   Risk Score: ${emp.balancedRiskScore.toFixed(2)}`);
            console.log(`   Performance: ${emp.performanceScore} | Engagement: ${emp.engagementScore}`);
            console.log(`   Tenure: ${emp.tenure} years`);
            
            console.log(`   🎯 RESCUE PLAN:`);
            
            if (emp.performanceScore < 3.0) {
                console.log(`   • Performance Improvement Plan with clear milestones`);
                console.log(`   • Daily check-ins for first 2 weeks`);
                console.log(`   • Reduced workload with focused tasks`);
            }
            
            if (emp.engagementScore < 50) {
                console.log(`   • Immediate workload reduction (50% for 2 weeks)`);
                console.log(`   • Professional counseling support`);
                console.log(`   • Flexible work arrangement`);
            }
            
            if (emp.balancedRiskScore >= 0.7) {
                console.log(`   • Executive-level retention conversation`);
                console.log(`   • Significant compensation review`);
                console.log(`   • Accelerated promotion consideration`);
            }
            
            console.log(`   📅 SUCCESS METRICS:`);
            console.log(`   • 30-day performance improvement to 3.5+`);
            console.log(`   • 60-day engagement improvement of 20+ points`);
            console.log(`   • 90-day retention confirmation\n`);
        });
    }
}

// Run crisis response
async function main() {
    console.log('🚨 INITIATING CRISIS RESPONSE FOR ENGINEERING DEPARTMENT...\n');
    
    const response = new CrisisResponse();
    await response.generateCrisisResponsePlan();
    await response.generateIndividualRescuePlans();
    
    console.log('✅ Crisis response planning complete!');
    console.log('\n📞 ESCALATION PATH:');
    console.log('   • Immediate: Engineering Director');
    console.log('   • 24 hours: VP of Engineering');
    console.log('   • 48 hours: CTO/CEO briefing');
}

main().catch(console.error);