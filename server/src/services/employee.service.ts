import { ObjectId, Collection, Db } from 'mongodb';
import { getDb } from '../db/connect';
import { Employee } from '../models/employee.model';
import { ApiError } from '../errors/apiError';

export class EmployeeService {
  static async getEmployees(query: any): Promise<Employee[]> {
    const db = await getDb();
    const collection = db.collection<Employee>('employees');
    const filter: any = {};

    if (query.department) {
      filter.department = new RegExp(query.department, 'i');
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.minRisk || query.maxRisk) {
      filter.riskScore = {};
      if (query.minRisk) filter.riskScore.$gte = Number(query.minRisk);
      if (query.maxRisk) filter.riskScore.$lte = Number(query.maxRisk);
    }

    return collection.find(filter).toArray();
  }

  static async getEmployeeById(id: ObjectId): Promise<Employee> {
    const db = await getDb();
    const collection = db.collection<Employee>('employees');
    const employee = await collection.findOne({ _id: id });

    if (!employee) {
      throw new ApiError('Employee not found', 404);
    }

    return employee;
  }

  static async createEmployee(employeeData: Omit<Employee, '_id'>): Promise<Employee> {
    const db = await getDb();
    const collection = db.collection<Employee>('employees');
    const newEmployee = {
      ...employeeData,
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(newEmployee);
   const inserted = await collection.findOne({ _id: result.insertedId });

    if (!inserted) {
      throw new ApiError('Failed to create employee', 500);
    }
    return inserted;
  }

  
  static async updateEmployee(id: ObjectId, updateData: Partial<Employee>): Promise<Employee> {
    const db = await getDb();
    const collection = db.collection<Employee>('employees');
    const update = {
      ...updateData,
      updatedAt: new Date()
    };

    const result = await collection.findOneAndUpdate(
      { _id: id },
      { $set: update },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      throw new ApiError('Employee not found', 404);
    }

    return result.value;
  }

  static async deleteEmployee(id: ObjectId): Promise<void> {
    const db = await getDb();
    const collection = db.collection<Employee>('employees');
    const result = await collection.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      throw new ApiError('Employee not found', 404);
    }
  }
}