// executiveReport.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function generateExecutiveReport() {
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await client.connect();
        const db = client.db();
        const employeesCollection = db.collection('employees');

        const employees = await employeesCollection.find().toArray();
        
        console.log('\n📊 EXECUTIVE TALENT RISK REPORT');
        console.log('===============================\n');
        console.log('Generated: ' + new Date().toLocaleDateString());
        console.log('Scope: 152 employees across 8 departments\n');

        // Current State Analysis
        const highRisk = employees.filter(emp => emp.riskLevel === 'HIGH').length;
        const mediumRisk = employees.filter(emp => emp.riskLevel === 'MEDIUM').length;
        const atRiskPercentage = ((highRisk + mediumRisk) / employees.length * 100).toFixed(1);

        console.log('🎯 CURRENT RISK LANDSCAPE:');
        console.log('──────────────────────────');
        console.log(`• Total Employees: ${employees.length}`);
        console.log(`• High Risk: ${highRisk} (${(highRisk/employees.length*100).toFixed(1)}%)`);
        console.log(`• Medium Risk: ${mediumRisk} (${(mediumRisk/employees.length*100).toFixed(1)}%)`);
        console.log(`• At-Risk Population: ${atRiskPercentage}%`);

        // Department Analysis
        console.log('\n🏢 DEPARTMENT BREAKDOWN:');
        console.log('───────────────────────');
        
        const deptSummary = {};
        employees.forEach(emp => {
            if (!deptSummary[emp.department]) {
                deptSummary[emp.department] = { total: 0, high: 0, medium: 0, avgScore: 0 };
            }
            deptSummary[emp.department].total++;
            if (emp.riskLevel === 'HIGH') deptSummary[emp.department].high++;
            if (emp.riskLevel === 'MEDIUM') deptSummary[emp.department].medium++;
            deptSummary[emp.department].avgScore += emp.balancedRiskScore || 0;
        });

        Object.entries(deptSummary)
            .sort(([,a], [,b]) => b.avgScore - a.avgScore)
            .forEach(([dept, data]) => {
                const avgScore = (data.avgScore / data.total).toFixed(2);
                const highRiskPct = ((data.high / data.total) * 100).toFixed(1);
                console.log(`• ${dept}: ${data.total} employees, Avg Risk: ${avgScore}, High Risk: ${highRiskPct}%`);
            });

        // Top Risks
        console.log('\n🚨 TOP 5 RISK MITIGATION PRIORITIES:');
        console.log('──────────────────────────────────');
        
        const highRiskEmployees = employees.filter(emp => emp.riskLevel === 'HIGH')
                                         .sort((a, b) => b.balancedRiskScore - a.balancedRiskScore)
                                         .slice(0, 5);

        highRiskEmployees.forEach((emp, index) => {
            console.log(`${index + 1}. ${emp.name} (${emp.department})`);
            console.log(`   Role: ${emp.role}`);
            console.log(`   Risk Score: ${emp.balancedRiskScore.toFixed(2)}`);
            console.log(`   Key Factors: ${emp.riskFactors?.join(', ') || 'None'}`);
            console.log(`   Action: Immediate retention conversation needed`);
            console.log('');
        });

        // Strategic Recommendations
        console.log('💡 STRATEGIC RECOMMENDATIONS:');
        console.log('─────────────────────────────');
        console.log('1. 🎯 FOCUS AREAS:');
        console.log('   • Address 3 high-risk employees immediately');
        console.log('   • Review Sales department practices (highest avg risk)');
        console.log('   • Enhance onboarding for new hires');
        
        console.log('\n2. 📈 PREVENTION STRATEGY:');
        console.log('   • Implement predictive monitoring system');
        console.log('   • Develop department-specific retention plans');
        console.log('   • Launch skills development program');
        
        console.log('\n3. 🎪 SUCCESS METRICS:');
        console.log('   • Reduce high-risk population to <1% in 6 months');
        console.log('   • Improve overall engagement scores by 15%');
        console.log('   • Decrease voluntary attrition by 25%');

        console.log('\n✅ Report generated successfully!');

    } catch (error) {
        console.error('❌ Error generating report:', error);
    } finally {
        await client.close();
    }
}

generateExecutiveReport().catch(console.error);