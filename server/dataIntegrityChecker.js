// dataIntegrityChecker.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkDataIntegrity() {
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await client.connect();
        const db = client.db();
        
        console.log('🔍 DATA INTEGRITY ANALYSIS');
        console.log('==========================\n');

        // Check employees collection
        const employees = await db.collection('employees').find().toArray();
        console.log(`👥 Employees: ${employees.length} total`);

        // Check skills data linkage
        const skillsData = await db.collection(' Skills Inventory').find().toArray();
        console.log(`📚 Skills Records: ${skillsData.length} total`);

        // Check how many employees have skills data
        let employeesWithSkills = 0;
        const skillsEmployeeIds = skillsData.map(s => s.employeeId);
        
        employees.forEach(emp => {
            if (skillsEmployeeIds.includes(emp.employeeId) || 
                skillsEmployeeIds.includes(emp.email) ||
                skillsEmployeeIds.includes(emp._id.toString())) {
                employeesWithSkills++;
            }
        });

        console.log(`🔗 Employees with skills data: ${employeesWithSkills} (${((employeesWithSkills/employees.length)*100).toFixed(1)}%)`);

        // Check for missing critical fields
        const missingFields = {
            performanceScore: 0,
            tenure: 0,
            engagementScore: 0,
            lastPromotion: 0
        };

        employees.forEach(emp => {
            if (!emp.performanceScore) missingFields.performanceScore++;
            if (!emp.tenure) missingFields.tenure++;
            if (!emp.engagementScore) missingFields.engagementScore++;
            if (!emp.lastPromotion) missingFields.lastPromotion++;
        });

        console.log('\n📊 MISSING CRITICAL DATA:');
        Object.entries(missingFields).forEach(([field, count]) => {
            const percentage = ((count / employees.length) * 100).toFixed(1);
            console.log(`   ${field}: ${count} missing (${percentage}%)`);
        });

        // Sample analysis of risk factors
        console.log('\n🎯 CURRENT RISK FACTOR ANALYSIS:');
        const highRiskEmployees = employees.filter(emp => 
            emp.riskLevel === 'CRITICAL' || emp.riskLevel === 'HIGH'
        );
        
        if (highRiskEmployees.length > 0) {
            const sampleHighRisk = highRiskEmployees[0];
            console.log('Sample high-risk employee analysis:');
            console.log(`   Name: ${sampleHighRisk.name}`);
            console.log(`   Risk Score: ${sampleHighRisk.enhancedRiskScore}`);
            console.log(`   Risk Level: ${sampleHighRisk.riskLevel}`);
            console.log(`   Factors: ${sampleHighRisk.riskFactors?.join(', ') || 'None'}`);
        }

    } catch (error) {
        console.error('❌ Error in data integrity check:', error);
    } finally {
        await client.close();
    }
}

checkDataIntegrity().catch(console.error);