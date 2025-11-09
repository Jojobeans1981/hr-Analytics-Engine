import { Router } from "express";
import { Employee } from "../models/Employee";  
const router = Router();

// GET all employees (with optional filters)
router.get("/", async (req, res) => {
  try {
    const { department, name, role, riskScore  } = req.query;

    const query: any = {};

    if (department) {
      query.department = department;
    }
    if (status) {
      query.status = status;
    }
//     // if (minRisk || maxRisk) {
//     //   query.riskScore = {};
//     //   if (minRisk) query.riskScore.$gte = parseFloat(minRisk as string);
//     //   if (maxRisk) query.riskScore.$lte = parseFloat(maxRisk as string);
//     // }

//     const employees = await Employee.find(query);

//     res.json({
//       success: true,
//       count: employees.length,
//       data: employees,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// GET employee by ID
router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json({ success: true, data: employee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST create new employee
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const employee = new Employee({
      ...data,
      riskScore: data.riskScore ?? 5.0, // default if not provided
      status: "active",
    });
    await employee.save();

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: "Invalid data" });
  }
});

// PUT update employee
router.put("/:id", async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json({
      success: true,
      message: "Employee updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: "Update failed" });
  }
});

export default router;