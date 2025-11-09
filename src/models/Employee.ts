// src/models/Employee.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IEmployee extends Document {
  name: string;
  role: string;
  riskScore: number;
  department: string;
}

const employeeSchema = new Schema<IEmployee>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    riskScore: { type: Number, required: true },
    department: { type: String, required: true },
  },
  { timestamps: true }
);

// Static methods can replicate your class behavior
employeeSchema.statics.getHighRisk = function (threshold = 0.7) {
  return this.find({ riskScore: { $gt: threshold } });
};

employeeSchema.statics.getDepartments = function () {
  return this.distinct("department");
};

export interface IEmployeeModel extends mongoose.Model<IEmployee> {
  getHighRisk(threshold?: number): Promise<IEmployee[]>;
  getDepartments(): Promise<string[]>;
}

export const Employee = mongoose.model<IEmployee, IEmployeeModel>(
  "Employee",
  employeeSchema
);