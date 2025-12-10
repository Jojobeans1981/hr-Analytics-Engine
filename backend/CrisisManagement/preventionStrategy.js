// preventionStrategy.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

class PreventionStrategy {
    constructor() {
        this.client = new MongoClient(process.env.MONGODB_URI);
    }

    async developPreventionStrategy() {
        await this.client.connect();
        const db = this.client.db();
        const employeesCollection = db.collection('employees');

        const employees = await employeesCollection.find().toArray();
        
        console.log('\n🛡️  TALENT RISK PREVENTION STRATEGY');
        console.log('==================================\n');

        // Analyze organizational patterns
        const patterns = this.analyzeRiskPatterns(employees);

        console.log('🎯 PREVENTION FOCUS AREAS:');
        console.log('─────────────────────────');
        
        patterns.forEach((pattern, index) => {
            console.log(`${index + 1}. ${pattern.area}`);
            console.log(`   📊 Impact: ${pattern.impact} employees`);
            console.log(`   🎯 Strategy: ${pattern.strategy}`);
            console.log(`   📅 Timeline: ${pattern.timeline}`);
            console.log('');
        });

        // Department-specific strategies
        console.log('🏢 DEPARTMENT-SPECIFIC STRATEGIES:');
        console.log('─────────────────────────────────');
        
        const deptStrategies = this.getDepartmentStrategies(employees);
        Object.entries(deptStrategies).forEach(([dept, strategies]) => {
            console.log(`\n${dept.toUpperCase()}:`);
            strategies.forEach(strategy => {
                console.log(`   • ${strategy}`);
            });
        });

        // Early warning system
        console.log('\n🔔 EARLY WARNING SYSTEM IMPLEMENTATION:');
        console.log('─────────────────────────────────────');
        console.log('1. Automated Risk Monitoring:');
        console.log('   • Real-time engagement tracking');
        console.log('   • Workload capacity alerts');
        console.log('   • Promotion delay notifications');

        console.log('\n2. Preventive Interventions:');
        console.log('   • Quarterly career path discussions');
        console.log('   • Annual skills gap analysis');
        console.log('   • Bi-annual workload assessments');

        console.log('\n3. Manager Training:');
        console.log('   • Risk identification workshops');
        console.log('   • Retention conversation training');
        console.log('   • Burnout prevention certification');

        await this.client.close();
    }

    analyzeRiskPatterns(employees) {
        return [
            {
                area: 'Workload Burnout Prevention',
                impact: employees.filter(emp => emp.engagementScore < 70).length,
                strategy: 'Implement workload transparency and capacity planning',
                timeline: 'Quarter 1'
            },
            {
                area: 'High Performer Retention',
                impact: employees.filter(emp => emp.performanceScore > 4.5).length,
                strategy: 'Accelerated advancement and recognition programs',
                timeline: 'Quarter 1'
            },
            {
                area: 'Skills Future-Proofing',
                impact: employees.filter(emp => emp.tenure > 3).length,
                strategy: 'Continuous learning and modern tech stack training',
                timeline: 'Quarter 2'
            },
            {
                area: 'New Hire Success',
                impact: employees.filter(emp => emp.tenure < 1).length,
                strategy: 'Enhanced onboarding and mentorship program',
                timeline: 'Quarter 1'
            }
        ];
    }

    getDepartmentStrategies(employees) {
        return {
            'Engineering': [
                'Workload capacity planning and hiring plan',
                'Technical career ladder implementation',
                'Modern skills development program',
                'Engineering wellness initiative'
            ],
            'Sales': [
                'Sustainable quota setting',
                'Advanced sales training',
                'Career path to management',
                'Recognition and rewards program'
            ],
            'Marketing': [
                'Creative innovation time',
                'Digital skills certification',
                'Cross-functional project opportunities',
                'Industry conference participation'
            ],
            'HR': [
                'HR business partner career development',
                'Leadership training program',
                'Talent analytics specialization',
                'Executive presence coaching'
            ]
        };
    }
}

// Run prevention strategy
async function main() {
    console.log('🛡️  DEVELOPING TALENT RISK PREVENTION STRATEGY...\n');
    
    const strategy = new PreventionStrategy();
    await strategy.developPreventionStrategy();
    
    console.log('\n✅ Prevention strategy developed!');
    console.log('Next: Implement quarterly review cycle');
}

main().catch(console.error);