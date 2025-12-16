// liveMonitor.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

class LiveMonitor {
    constructor() {
        this.client = new MongoClient(process.env.MONGODB_URI);
    }

    async startLiveMonitoring() {
        console.log('📡 STARTING LIVE TALENT RISK MONITOR...\n');
        console.log('Monitoring will refresh every 30 seconds...\n');

        // Initial scan
        await this.performScan();
        
        // Set up periodic scanning (in real app, this would be a proper scheduler)
        setInterval(async () => {
            await this.performScan();
        }, 30000);
    }

    async performScan() {
        try {
            await this.client.connect();
            const db = this.client.db();
            const employeesCollection = db.collection('employees');

            const employees = await employeesCollection.find().toArray();
            const timestamp = new Date().toLocaleTimeString();

            // Calculate current stats
            const highRisk = employees.filter(emp => emp.riskLevel === 'HIGH').length;
            const mediumRisk = employees.filter(emp => emp.riskLevel === 'MEDIUM').length;
            const totalRisk = highRisk + mediumRisk;
            const riskPercentage = ((totalRisk / employees.length) * 100).toFixed(1);

            console.log(`🕒 ${timestamp} - LIVE RISK DASHBOARD`);
            console.log('====================================');
            console.log(`👥 Total Employees: ${employees.length}`);
            console.log(`🔴 High Risk: ${highRisk}`);
            console.log(`🟡 Medium Risk: ${mediumRisk}`);
            console.log(`📈 At-Risk Population: ${riskPercentage}%`);
            
            // Show any new high-risk employees
            const currentHighRisk = employees.filter(emp => emp.riskLevel === 'HIGH');
            if (currentHighRisk.length > 0) {
                console.log(`\n🚨 ACTIVE HIGH-RISK EMPLOYEES:`);
                currentHighRisk.forEach(emp => {
                    console.log(`   • ${emp.name} (${emp.department}) - Score: ${emp.balancedRiskScore.toFixed(2)}`);
                });
            }

            console.log('\n------------------------------------\n');

        } catch (error) {
            console.error('❌ Monitoring error:', error.message);
        } finally {
            await this.client.close();
        }
    }
}

// Start live monitoring
async function main() {
    const monitor = new LiveMonitor();
    await monitor.startLiveMonitoring();
}

main().catch(console.error);