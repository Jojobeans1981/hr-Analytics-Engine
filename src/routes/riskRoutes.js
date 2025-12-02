// backend/src/routes/riskRoutes.js
const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

// Get all employees with risk data
router.get('/employees', async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await client.connect();
        const db = client.db();
        const employeesCollection = db.collection('employees');
        
        const employees = await employeesCollection.find({})
            .project({
                name: 1,
                email: 1,
                department: 1,
                role: 1,
                balancedRiskScore: 1,
                riskLevel: 1,
                riskFactors: 1,
                positiveFactors: 1,
                confidenceScore: 1,
                tenure: 1,
                performanceScore: 1,
                engagementScore: 1,
                lastPromotion: 1,
                lastRiskUpdate: 1
            })
            .toArray();
            
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await client.close();
    }
});

// Get risk dashboard summary
router.get('/dashboard/summary', async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await client.connect();
        const db = client.db();
        const employeesCollection = db.collection('employees');
        
        const employees = await employeesCollection.find({}).toArray();
        
        // Calculate summary statistics
        const totalEmployees = employees.length;
        const highRisk = employees.filter(emp => emp.riskLevel === 'HIGH').length;
        const mediumRisk = employees.filter(emp => emp.riskLevel === 'MEDIUM').length;
        const lowRisk = employees.filter(emp => emp.riskLevel === 'LOW').length;
        const minimalRisk = employees.filter(emp => emp.riskLevel === 'MINIMAL').length;
        
        // Department breakdown
        const departmentData = {};
        employees.forEach(emp => {
            if (!departmentData[emp.department]) {
                departmentData[emp.department] = { total: 0, highRisk: 0, avgRisk: 0 };
            }
            departmentData[emp.department].total++;
            if (emp.riskLevel === 'HIGH') departmentData[emp.department].highRisk++;
            departmentData[emp.department].avgRisk += emp.balancedRiskScore || 0;
        });
        
        // Calculate averages
        Object.keys(departmentData).forEach(dept => {
            departmentData[dept].avgRisk = (departmentData[dept].avgRisk / departmentData[dept].total).toFixed(2);
        });
        
        res.json({
            totalEmployees,
            riskDistribution: { highRisk, mediumRisk, lowRisk, minimalRisk },
            departments: departmentData,
            lastUpdated: new Date()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await client.close();
    }
});

// Get high-risk employees
router.get('/employees/high-risk', async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await client.connect();
        const db = client.db();
        const employeesCollection = db.collection('employees');
        
        const highRiskEmployees = await employeesCollection.find({
            riskLevel: 'HIGH'
        })
        .sort({ balancedRiskScore: -1 })
        .limit(20)
        .toArray();
            
        res.json(highRiskEmployees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await client.close();
    }
});

// Get predictive alerts
router.get('/alerts/predictive', async (req, res) => {
    // This would integrate with your predictiveEngine.js
    // For now, return mock data or implement the logic here
    res.json({
        highRiskPredictions: [
            {
                employee: "Sarah Chen",
                department: "Engineering", 
                prediction: "Risk of seeking advancement opportunities externally",
                timeframe: "6-12 months",
                confidence: 75
            }
        ],
        totalPredictions: 35
    });
});

// Trigger risk score recalculation
router.post('/risk/recalculate', async (req, res) => {
    // This would trigger your fixedRiskScorer.js
    // In production, you'd want to run this as a background job
    res.json({ message: "Risk recalculation started", status: "processing" });
});

module.exports = router;