// departmentAnalyzer.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function analyzeDepartments() {
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await client.connect();
        const db = client.db();
        const employeesCollection = db.collection('employees');

        const employees = await employeesCollection.find().toArray();
        
        console.log('\n🏢 DEPARTMENT RISK ANALYSIS');
        console.log('===========================\n');

        // Group by department
        const departmentData = {};
        employees.forEach(emp => {
            if (!departmentData[emp.department]) {
                departmentData[emp.department] = {
                    total: 0,
                    highRisk: 0,
                    mediumRisk: 0,
                    lowRisk: 0,
                    minimalRisk: 0,
                    avgRiskScore: 0,
                    employees: []
                };
            }
            
            const dept = departmentData[emp.department];
            dept.total++;
            dept[emp.riskLevel.toLowerCase() + 'Risk']++;
            dept.avgRiskScore += emp.balancedRiskScore || 0;
            dept.employees.push(emp);
        });

        // Calculate averages and sort by risk
        const departmentArray = Object.entries(departmentData).map(([name, data]) => {
            data.avgRiskScore = data.avgRiskScore / data.total;
            return { name, ...data };
        }).sort((a, b) => b.avgRiskScore - a.avgRiskScore);

        console.log('📊 DEPARTMENT RISK OVERVIEW:');
        departmentArray.forEach(dept => {
            const highRiskPct = ((dept.highRisk / dept.total) * 100).toFixed(1);
            const avgScore = dept.avgRiskScore.toFixed(2);
            
            console.log(`\n${dept.name.toUpperCase()}:`);
            console.log(`   👥 Total Employees: ${dept.total}`);
            console.log(`   📈 Average Risk Score: ${avgScore}`);
            console.log(`   🔴 High Risk: ${dept.highRisk} (${highRiskPct}%)`);
            console.log(`   🟡 Medium Risk: ${dept.mediumRisk}`);
            console.log(`   🟢 Low/Minimal Risk: ${dept.lowRisk + dept.minimalRisk}`);
        });

        // Show highest risk department details
        const highestRiskDept = departmentArray[0];
        console.log(`\n🎯 HIGHEST RISK DEPARTMENT: ${highestRiskDept.name}`);
        console.log(`   Average Risk Score: ${highestRiskDept.avgRiskScore.toFixed(2)}`);
        
        const highRiskInDept = highestRiskDept.employees.filter(emp => emp.riskLevel === 'HIGH');
        if (highRiskInDept.length > 0) {
            console.log(`   High Risk Employees:`);
            highRiskInDept.forEach(emp => {
                console.log(`      - ${emp.name} (${emp.role}): ${emp.balancedRiskScore.toFixed(2)}`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
    }
}

analyzeDepartments().catch(console.error);