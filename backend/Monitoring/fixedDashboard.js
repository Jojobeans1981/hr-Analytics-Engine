// fixedDashboard.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function generateFixedDashboard() {
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await client.connect();
        const db = client.db();
        const employeesCollection = db.collection('employees');

        const employees = await employeesCollection.find().toArray();
        
        console.log('\n🚀 FIXED TALENT RISK DASHBOARD');
        console.log('===============================\n');
        
        // Check for balanced scores
        const hasBalancedScores = employees.some(emp => emp.balancedRiskScore !== undefined);
        
        if (!hasBalancedScores) {
            console.log('❌ No balanced risk scores found!');
            console.log('Run: node fixedRiskScorer.js');
            return;
        }

        // Risk distribution
        const distribution = { HIGH: 0, MEDIUM: 0, LOW: 0, MINIMAL: 0 };
        employees.forEach(emp => {
            distribution[emp.riskLevel] = (distribution[emp.riskLevel] || 0) + 1;
        });

        console.log('📊 RISK DISTRIBUTION:');
        Object.entries(distribution).forEach(([level, count]) => {
            const percentage = ((count / employees.length) * 100).toFixed(1);
            console.log(`   ${level}: ${count} employees (${percentage}%)`);
        });

        // High risk employees
        const highRisk = employees.filter(emp => emp.riskLevel === 'HIGH')
                                 .sort((a, b) => b.balancedRiskScore - a.balancedRiskScore);

        console.log(`\n🔴 HIGH RISK EMPLOYEES (${highRisk.length}):`);
        highRisk.slice(0, 8).forEach(emp => {
            console.log(`\n   👤 ${emp.name} - ${emp.role}`);
            console.log(`      Department: ${emp.department}`);
            console.log(`      Risk Score: ${emp.balancedRiskScore.toFixed(2)}`);
            console.log(`      Tenure: ${emp.tenure} yrs | Performance: ${emp.performanceScore} | Engagement: ${emp.engagementScore}`);
            console.log(`      Confidence: ${emp.confidenceScore}%`);
            console.log(`      Risk Factors: ${emp.riskFactors?.join(', ') || 'None'}`);
            if (emp.positiveFactors?.length > 0) {
                console.log(`      Strengths: ${emp.positiveFactors.join(', ')}`);
            }
        });

        console.log('\n✅ Dashboard generated successfully!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
    }
}

generateFixedDashboard().catch(console.error);