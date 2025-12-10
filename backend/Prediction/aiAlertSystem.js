// aiAlertSystem.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

class AIAlertSystem {
    constructor() {
        this.client = new MongoClient(process.env.MONGODB_URI);
        this.alertThresholds = {
            riskScore: 0.7,
            confidence: 70,
            departmentRisk: 0.25
        };
    }

    async monitorAndAlert() {
        await this.client.connect();
        const db = this.client.db();
        const employeesCollection = db.collection('employees');

        const employees = await employeesCollection.find().toArray();
        
        console.log('\n🚨 AI RISK ALERT SYSTEM');
        console.log('=======================\n');
        console.log('🤖 Monitoring 152 employees for emerging risks...\n');

        const alerts = [];

        // 1. High Individual Risk Alerts
        const highRiskAlerts = this.checkHighRiskIndividuals(employees);
        alerts.push(...highRiskAlerts);

        // 2. Department Risk Alerts
        const departmentAlerts = this.checkDepartmentRisks(employees);
        alerts.push(...departmentAlerts);

        // 3. Trend Alerts (simulated)
        const trendAlerts = this.checkRiskTrends(employees);
        alerts.push(...trendAlerts);

        // 4. Skills Gap Alerts
        const skillsAlerts = await this.checkSkillsGaps(employees, db);
        alerts.push(...skillsAlerts);

        // Display all alerts
        if (alerts.length === 0) {
            console.log('✅ No critical alerts detected. All systems normal.');
        } else {
            console.log(`🔴 ${alerts.length} ALERTS REQUIRING ATTENTION:\n`);
            
            alerts.forEach((alert, index) => {
                console.log(`${index + 1}. ${alert.type.toUpperCase()} ALERT: ${alert.message}`);
                console.log(`   🎯 Priority: ${alert.priority}`);
                console.log(`   📍 Department: ${alert.department}`);
                console.log(`   💡 Recommended Action: ${alert.action}`);
                console.log('');
            });

            // Generate summary for managers
            this.generateManagerSummary(alerts);
        }

        await this.client.close();
    }

    checkHighRiskIndividuals(employees) {
        const alerts = [];
        const highRiskEmployees = employees.filter(emp => 
            emp.riskLevel === 'HIGH' || (emp.balancedRiskScore || 0) >= this.alertThresholds.riskScore
        );

        highRiskEmployees.forEach(emp => {
            alerts.push({
                type: 'individual_risk',
                priority: 'HIGH',
                department: emp.department,
                message: `${emp.name} (${emp.role}) has high risk score: ${(emp.balancedRiskScore || 0).toFixed(2)}`,
                action: `Schedule retention conversation and create mitigation plan`,
                employee: emp.name
            });
        });

        return alerts;
    }

    checkDepartmentRisks(employees) {
        const alerts = [];
        const departmentData = {};

        // Calculate department averages
        employees.forEach(emp => {
            if (!departmentData[emp.department]) {
                departmentData[emp.department] = { total: 0, totalRisk: 0, employees: [] };
            }
            departmentData[emp.department].total++;
            departmentData[emp.department].totalRisk += emp.balancedRiskScore || 0;
            departmentData[emp.department].employees.push(emp);
        });

        // Check for high-risk departments
        Object.entries(departmentData).forEach(([dept, data]) => {
            const avgRisk = data.totalRisk / data.total;
            if (avgRisk >= this.alertThresholds.departmentRisk) {
                alerts.push({
                    type: 'department_risk',
                    priority: 'MEDIUM',
                    department: dept,
                    message: `${dept} department has elevated average risk: ${avgRisk.toFixed(2)}`,
                    action: `Conduct department-wide engagement survey and review management practices`,
                    metric: avgRisk
                });
            }

            // Check for high medium-risk concentration
            const mediumRiskCount = data.employees.filter(emp => emp.riskLevel === 'MEDIUM').length;
            const mediumRiskPercentage = (mediumRiskCount / data.total) * 100;
            if (mediumRiskPercentage > 40) {
                alerts.push({
                    type: 'risk_concentration',
                    priority: 'MEDIUM',
                    department: dept,
                    message: `${dept} has ${mediumRiskPercentage.toFixed(1)}% medium-risk employees`,
                    action: `Implement team development programs and career path discussions`,
                    metric: mediumRiskPercentage
                });
            }
        });

        return alerts;
    }

    checkRiskTrends(employees) {
        const alerts = [];
        
        // Simulate trend detection (in real system, you'd compare with historical data)
        const highMediumRiskCount = employees.filter(emp => 
            emp.riskLevel === 'HIGH' || emp.riskLevel === 'MEDIUM'
        ).length;
        
        const riskPercentage = (highMediumRiskCount / employees.length) * 100;
        
        if (riskPercentage > 25) {
            alerts.push({
                type: 'organizational_trend',
                priority: 'MEDIUM',
                department: 'Organization',
                message: `${riskPercentage.toFixed(1)}% of employees are medium/high risk`,
                action: `Review organizational policies and conduct leadership training`,
                metric: riskPercentage
            });
        }

        return alerts;
    }

    async checkSkillsGaps(employees, db) {
        const alerts = [];
        const skillsCollection = db.collection(' Skills Inventory');

        // Check for critical skill gaps across departments
        const criticalSkills = ['AI', 'Machine Learning', 'Cloud', 'Data Analysis'];
        const departmentsMissingSkills = new Set();

        for (const employee of employees.slice(0, 20)) { // Sample check
            const skillsData = await skillsCollection.findOne({
                $or: [
                    { employeeId: employee.employeeId },
                    { employeeId: employee.email },
                    { employeeEmail: employee.email }
                ]
            });

            if (skillsData && skillsData.technicalSkills) {
                const employeeSkills = skillsData.technicalSkills.map(s => s.skill);
                const missingCritical = criticalSkills.filter(skill => 
                    !employeeSkills.some(s => s && s.includes(skill))
                );

                if (missingCritical.length > 2) {
                    departmentsMissingSkills.add(employee.department);
                }
            }
        }

        if (departmentsMissingSkills.size > 0) {
            alerts.push({
                type: 'skills_gap',
                priority: 'LOW',
                department: Array.from(departmentsMissingSkills).join(', '),
                message: `Critical skill gaps detected in ${departmentsMissingSkills.size} departments`,
                action: `Launch upskilling programs for AI, Cloud, and Data Analysis`,
                metric: departmentsMissingSkills.size
            });
        }

        return alerts;
    }

    generateManagerSummary(alerts) {
        console.log('📋 EXECUTIVE SUMMARY FOR MANAGERS:');
        console.log('==================================\n');
        
        const priorityCount = { HIGH: 0, MEDIUM: 0, LOW: 0 };
        const departmentAlerts = {};
        
        alerts.forEach(alert => {
            priorityCount[alert.priority]++;
            if (!departmentAlerts[alert.department]) {
                departmentAlerts[alert.department] = 0;
            }
            departmentAlerts[alert.department]++;
        });

        console.log(`🔴 High Priority Alerts: ${priorityCount.HIGH}`);
        console.log(`🟡 Medium Priority Alerts: ${priorityCount.MEDIUM}`);
        console.log(`🟢 Low Priority Alerts: ${priorityCount.LOW}`);
        
        console.log('\n🏢 ALERTS BY DEPARTMENT:');
        Object.entries(departmentAlerts).forEach(([dept, count]) => {
            console.log(`   ${dept}: ${count} alert${count > 1 ? 's' : ''}`);
        });

        console.log('\n🎯 RECOMMENDED ACTIONS:');
        console.log('   1. Address HIGH priority alerts within 48 hours');
        console.log('   2. Review MEDIUM priority alerts in weekly leadership meeting');
        console.log('   3. Plan LONG-TERM solutions for LOW priority alerts');
    }
}

// Run the AI Alert System
async function main() {
    console.log('🤖 INITIATING AI RISK MONITORING...\n');
    
    const alertSystem = new AIAlertSystem();
    await alertSystem.monitorAndAlert();
    
    console.log('\n✅ AI monitoring cycle complete!');
    console.log('Next: Set up automated daily monitoring');
}

main().catch(console.error);