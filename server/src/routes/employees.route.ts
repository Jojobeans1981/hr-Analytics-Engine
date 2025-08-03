import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { createEmployeeSchema, updateEmployeeSchema } from './../validations/employee.validation';

const router = Router();

// Get all employees with their assessments
router.get('/', async (req, res) => {
  try {
    const { db } = req.app.locals;
    const employees = await db.collection('employees')
      .aggregate([
        {
          $lookup: {
            from: "assessments",
            localField: "_id",
            foreignField: "employeeId",
            as: "assessments"
          }
        },
        {
          $project: {
            name: 1,
            email: 1,
            position: 1,
            department: 1,
            riskScore: 1,
            assessmentCount: { $size: "$assessments" }
          }
        }
      ])
      .toArray();

    res.json(employees);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    });
  }
});

// Calculate risk score for an employee
router.get('/:id/risk-score', async (req, res) => {
  try {
    const { db } = req.app.locals;
    const employeeId = new ObjectId(req.params.id);

    const result = await db.collection('assessments')
      .aggregate([
        { $match: { employeeId } },
        { $group: { _id: null, avgScore: { $avg: "$score" } } }
      ])
      .toArray();

    const riskScore = result[0]?.avgScore || 0;
    
    // Update employee record
    await db.collection('employees').updateOne(
      { _id: employeeId },
      { $set: { riskScore } }
    );

    res.json({ riskScore });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    });
  }
});

export default router;