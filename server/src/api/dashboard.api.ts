import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { Db } from 'mongodb';

// Type definitions
interface Employee {
  _id: ObjectId;
  name: string;
  // Add other employee fields as needed
}

interface Assessment {
  _id: ObjectId;
  employeeId: ObjectId;
  overallRisk: number;
  assessmentDate: Date;
  employee?: Employee; // Added by $lookup
}

// Extend Express Request type to include db
declare module 'express' {
  interface Request {
    db?: Db;
  }
}

export const getDashboardMetrics = async (req: Request, res: Response) => {
  try {
    // Check if db is available
    if (!req.db) {
      throw new Error('Database connection not available');
    }
    const db = req.db;
    
    const [
      totalEmployees,
      highRiskCount,
      assessmentsCount,
      skillsCount,
      recentAssessments
    ] = await Promise.all([
      db.collection('Employees').countDocuments(),
      db.collection('Attrition Risk Factors').countDocuments({ overallRisk: { $gte: 7 } }),
      db.collection('Assessments').countDocuments(),
      db.collection('Skills Inventory').countDocuments(),
      db.collection<Assessment>('Assessments')
        .aggregate([
          { $sort: { assessmentDate: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: 'Employees',
              localField: 'employeeId',
              foreignField: '_id',
              as: 'employee'
            }
          },
          { $unwind: '$employee' }
        ]).toArray()
    ]);

    res.json({
      metrics: {
        totalEmployees,
        highRiskCount,
        assessmentsCount,
        skillsCount
      },
      recentAssessments: recentAssessments.map((a: Assessment) => ({
        _id: a._id,
        employeeName: a.employee?.name || 'Unknown',
        riskScore: a.overallRisk,
        date: a.assessmentDate
      }))
    });
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    res.status(500).json({ 
      error: 'Failed to load dashboard data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};