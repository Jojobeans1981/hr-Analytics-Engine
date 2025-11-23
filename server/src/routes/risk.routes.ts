// src/routes/risk.routes.ts
import { Router } from 'express';
import { MongoClient } from 'mongodb';

const router = Router();

// Get AI risk dashboard data - compatible with existing frontend
router.get('/dashboard-metrics', async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URI!);
    
    try {
        await client.connect();
        const db = client.db();
        const employeesCollection = db.collection('employees');

        const employees = await employeesCollection.find({}).toArray();
        
        // Calculate metrics compatible with existing frontend
        const totalEmployees = employees.length;
        
        // Risk levels - convert AI levels to existing format
        const highRisk = employees.filter(emp => 
            emp.riskLevel === 'HIGH' || emp.riskLevel === 'CRITICAL' || (emp.riskScore && emp.riskScore >= 70)
        ).length;
        
        const mediumRisk = employees.filter(emp => 
            emp.riskLevel === 'MEDIUM' || (emp.riskScore && emp.riskScore >= 30 && emp.riskScore < 70)
        ).length;
        
        const lowRisk = employees.filter(emp => 
            emp.riskLevel === 'LOW' || emp.riskLevel === 'MINIMAL' || (emp.riskScore && emp.riskScore < 30)
        ).length;

        // Calculate average risk score
        const avgRiskScore = employees.reduce((sum, emp) => {
            // Use AI balanced score first, then fallback to riskScore, then risk
            const score = emp.balancedRiskScore || emp.riskScore || emp.risk || 0;
            return sum + (score * 100); // Convert to percentage
        }, 0) / totalEmployees;

        // Department breakdown
        const departmentData: { [key: string]: number } = {};
        employees.forEach(emp => {
            departmentData[emp.department] = (departmentData[emp.department] || 0) + 1;
        });

        const departments = Object.keys(departmentData);

        // AI Metrics for enhanced dashboard
        const aiMetrics = {
            predictions: employees.filter(emp => 
                emp.riskFactors && emp.riskFactors.length > 0
            ).length,
            highRiskPredictions: highRisk,
            avgConfidence: Math.round(employees.reduce((sum, emp) => 
                sum + (emp.confidenceScore || 75), 0
            ) / totalEmployees),
            lastRiskUpdate: new Date().toISOString()
        };

        res.json({
            totalEmployees,
            avgRisk: Math.round(avgRiskScore),
            departments,
            riskLevels: {
                High: highRisk,
                Medium: mediumRisk,
                Low: lowRisk
            },
            // Include AI metrics for enhanced dashboard
            aiMetrics
        });
    } catch (error) {
        console.error('Risk dashboard error:', error);
        res.status(500).json({ error: (error as Error).message });
    } finally {
        await client.close();
    }
});

// Get employees - compatible with existing frontend
router.get('/employees', async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URI!);
    
    try {
        await client.connect();
        const db = client.db();
        const employeesCollection = db.collection('employees');

        const employees = await employeesCollection.find({})
            .project({
                _id: 1,
                name: 1,
                email: 1,
                department: 1,
                role: 1,
                // AI Risk Fields
                balancedRiskScore: 1,
                riskLevel: 1,
                riskFactors: 1,
                positiveFactors: 1,
                confidenceScore: 1,
                // Legacy fields for compatibility
                riskScore: 1,
                risk: 1,
                lastRiskUpdate: 1
            })
            .toArray();

        // Transform data for frontend compatibility
        const transformedEmployees = employees.map(emp => {
            // Calculate risk score for frontend (0-100)
            const riskScore = emp.balancedRiskScore ? Math.round(emp.balancedRiskScore * 100) : 
                            emp.riskScore ? emp.riskScore : 
                            emp.risk ? Math.round(emp.risk * 100) : 0;
            
            // Determine risk level for frontend
            let riskLevel: string;
            if (emp.riskLevel) {
                // Convert AI risk levels to frontend format
                riskLevel = emp.riskLevel === 'CRITICAL' || emp.riskLevel === 'HIGH' ? 'High' :
                           emp.riskLevel === 'MEDIUM' ? 'Medium' : 'Low';
            } else {
                // Fallback to score-based calculation
                riskLevel = riskScore >= 70 ? 'High' : 
                           riskScore >= 30 ? 'Medium' : 'Low';
            }

            return {
                _id: emp._id,
                name: emp.name,
                email: emp.email,
                department: emp.department,
                role: emp.role,
                riskScore,
                risk: emp.balancedRiskScore || emp.risk || 0,
                riskLevel,
                // Include AI data for enhanced features
                aiRiskData: {
                    balancedRiskScore: emp.balancedRiskScore,
                    riskFactors: emp.riskFactors || [],
                    positiveFactors: emp.positiveFactors || [],
                    confidenceScore: emp.confidenceScore || 75,
                    lastUpdate: emp.lastRiskUpdate
                }
            };
        });

        // Return direct array (no .employees wrapper)
        res.json(transformedEmployees);
    } catch (error) {
        console.error('Risk employees error:', error);
        res.status(500).json({ error: (error as Error).message });
    } finally {
        await client.close();
    }
});

// Keep the other routes as they are for AI features
router.get('/dashboard', async (req, res) => {
    // ... same implementation as above but without /dashboard-metrics wrapper
});

router.get('/alerts/high-risk', async (req, res) => {
    // ... same implementation as before
});

router.post('/analyze', async (req, res) => {
    // ... same implementation as before
});

export default router;