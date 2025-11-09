import { Router } from "express";
import { Employee } from "../models/employee.model.js";

const router = Router();
router.get("/", async (_req, res) => {
  try {
    const employees = await Employee.find();
    res.json({ success: true, employees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Summary route (for dashboard metrics)
router.get("/summary", async (_req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();

    const avgRiskResult = await Employee.aggregate([
      { $group: { _id: null, avgRisk: { $avg: "$riskScore" } } },
    ]);
    const avgRisk =
      avgRiskResult.length > 0
        ? Number(avgRiskResult[0].avgRisk.toFixed(2))
        : 0;

    // Employees per department
    const departmentCounts = await Employee.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Risk levels distribution (derived in aggregation too)
    const riskDistribution = await Employee.aggregate([
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lt: ["$riskScore", 0.4] }, then: "Low" },
                {
                  case: {
                    $and: [
                      { $gte: ["$riskScore", 0.4] },
                      { $lt: ["$riskScore", 0.7] },
                    ],
                  },
                  then: "Medium",
                },
                { case: { $gte: ["$riskScore", 0.7] }, then: "High" },
              ],
              default: "Unknown",
            },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      totalEmployees,
      avgRisk,
      departments: departmentCounts.reduce((acc, d) => {
        acc[d._id] = d.count;
        return acc;
      }, {} as Record<string, number>),
      riskLevels: riskDistribution.reduce((acc, d) => {
        acc[d._id] = d.count;
        return acc;
      }, {} as Record<string, number>),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
export default router;