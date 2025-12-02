import { ObjectId } from 'mongodb';
import { TalentRiskAssessor } from '../utils/TalentRiskAssessor';

// Interface for employee data
export interface Employee {
  _id?: ObjectId;
  id?: string;
  name: string;
  email: string;
  department: string;
  position: string;
  performanceRating?: number;
  tenure?: number; // months
  engagementScore?: number; // 0-1 scale
  compRatio?: number; // compensation ratio
  criticalSkills?: string[];
  skillGaps?: string[];
  riskScore?: number; // 0-100 percentage
  risk?: number; // 0-1 scale (backward compatibility)
  riskLevel?: 'Low' | 'Medium' | 'High';
  riskFactors?: any;
  riskTrend?: 'improving' | 'deteriorating' | 'stable';
  hireDate?: Date;
  lastReviewDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RiskBreakdown {
  high: number;
  medium: number;
  low: number;
}

export interface DashboardSummary {
  totalEmployees: number;
  avgRisk: number;
  departments: string[];
  riskLevels: RiskBreakdown;
}

export class EmployeeService {
  private riskAssessor = new TalentRiskAssessor();

  // Static methods for controller (MongoDB operations)
  static async getEmployeeById(id: ObjectId): Promise<Employee | null> {
    try {
      // TODO: Replace with your actual MongoDB collection
      // const employee = await db.collection('employees').findOne({ _id: id });
      
      // Mock implementation for deployment
      const mockEmployee: Employee = {
        _id: id,
        name: 'John Doe',
        email: 'john.doe@company.com',
        department: 'Engineering',
        position: 'Software Engineer',
        performanceRating: 4.2,
        tenure: 18,
        engagementScore: 0.8,
        compRatio: 0.9,
        criticalSkills: ['JavaScript', 'React', 'Node.js'],
        skillGaps: ['TypeScript'],
        riskScore: 45,
        riskLevel: 'Medium',
        hireDate: new Date('2023-01-15'),
        lastReviewDate: new Date('2024-01-15'),
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date()
      };
      
      return mockEmployee;
    } catch (error) {
      console.error('Error fetching employee by ID:', error);
      throw new Error('Failed to fetch employee');
    }
  }

  static async updateEmployee(id: ObjectId, updateData: Partial<Employee>): Promise<Employee | null> {
    try {
      // TODO: Replace with your actual MongoDB update
      // const result = await db.collection('employees').findOneAndUpdate(
      //   { _id: id },
      //   { $set: { ...updateData, updatedAt: new Date() } },
      //   { returnDocument: 'after' }
      // );
      
      // Mock implementation for deployment
      const existingEmployee = await this.getEmployeeById(id);
      if (!existingEmployee) {
        return null;
      }
      
      const updatedEmployee: Employee = {
        ...existingEmployee,
        ...updateData,
        updatedAt: new Date()
      };
      
      // Recalculate risk if relevant fields were updated
      if (this.shouldRecalculateRisk(updateData)) {
        const riskAssessor = new TalentRiskAssessor();
        const riskAssessment = riskAssessor.calculateAdvancedRisk(updatedEmployee);
        updatedEmployee.riskScore = riskAssessment.score;
        updatedEmployee.riskLevel = this.getRiskLevel(riskAssessment.score);
        updatedEmployee.riskFactors = riskAssessment.factors;
        updatedEmployee.riskTrend = riskAssessment.trend;
        updatedEmployee.risk = riskAssessment.score / 100;
      }
      
      return updatedEmployee;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw new Error('Failed to update employee');
    }
  }

  static async createEmployee(employeeData: Omit<Employee, '_id' | 'riskScore' | 'riskLevel' | 'riskFactors' | 'riskTrend'>): Promise<Employee> {
    try {
      // TODO: Replace with your actual MongoDB insert
      // const result = await db.collection('employees').insertOne({
      //   ...employeeData,
      //   riskScore: 0,
      //   riskLevel: 'Low',
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // });
      
      // Calculate initial risk
      const riskAssessor = new TalentRiskAssessor();
      const riskAssessment = riskAssessor.calculateAdvancedRisk(employeeData);
      
      // Mock implementation for deployment
      const newEmployee: Employee = {
        _id: new ObjectId(),
        ...employeeData,
        riskScore: riskAssessment.score,
        riskLevel: this.getRiskLevel(riskAssessment.score),
        riskFactors: riskAssessment.factors,
        riskTrend: riskAssessment.trend,
        risk: riskAssessment.score / 100,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      return newEmployee;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw new Error('Failed to create employee');
    }
  }

  static async deleteEmployee(id: ObjectId): Promise<boolean> {
    try {
      // TODO: Replace with your actual MongoDB delete
      // const result = await db.collection('employees').deleteOne({ _id: id });
      // return result.deletedCount === 1;
      
      // Mock implementation for deployment
      console.log(`Deleting employee with ID: ${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw new Error('Failed to delete employee');
    }
  }

  // Instance methods for risk assessment and batch operations
  async getEmployeesWithRisk(): Promise<Employee[]> {
    try {
      const employees = await this.fetchEmployees();
      
      return employees.map(emp => {
        const riskAssessment = this.riskAssessor.calculateAdvancedRisk(emp);
        const riskLevel = EmployeeService.getRiskLevel(riskAssessment.score);
        
        return {
          ...emp,
          riskScore: riskAssessment.score,
          riskLevel,
          riskFactors: riskAssessment.factors,
          riskTrend: riskAssessment.trend,
          risk: riskAssessment.score / 100 // Backward compatibility
        };
      });
    } catch (error) {
      console.error('Error calculating employee risks:', error);
      throw error;
    }
  }

  async getHighRiskEmployees(threshold: number = 70): Promise<Employee[]> {
    const employees = await this.getEmployeesWithRisk();
    return employees.filter(emp => emp.riskScore >= threshold);
  }

  async getRiskBreakdown(): Promise<RiskBreakdown> {
    const employees = await this.getEmployeesWithRisk();
    
    return {
      high: employees.filter(emp => emp.riskScore >= 70).length,
      medium: employees.filter(emp => emp.riskScore >= 30 && emp.riskScore < 70).length,
      low: employees.filter(emp => emp.riskScore < 30).length
    };
  }

  async getDashboardSummary(): Promise<DashboardSummary> {
    const employees = await this.getEmployeesWithRisk();
    const departments = [...new Set(employees.map(emp => emp.department))];
    const riskBreakdown = await this.getRiskBreakdown();
    
    const totalRisk = employees.reduce((sum, emp) => sum + (emp.riskScore || 0), 0);
    const avgRisk = employees.length > 0 ? totalRisk / employees.length : 0;
    
    return {
      totalEmployees: employees.length,
      avgRisk,
      departments,
      riskLevels: riskBreakdown
    };
  }

  async recalculateAllRisks(): Promise<number> {
    try {
      const employees = await this.fetchEmployees();
      let updatedCount = 0;
      
      for (const employee of employees) {
        const riskAssessment = this.riskAssessor.calculateAdvancedRisk(employee);
        const riskLevel = EmployeeService.getRiskLevel(riskAssessment.score);
        
        // TODO: Update in database
        // await db.collection('employees').updateOne(
        //   { _id: employee._id },
        //   {
        //     $set: {
        //       riskScore: riskAssessment.score,
        //       riskLevel,
        //       riskFactors: riskAssessment.factors,
        //       riskTrend: riskAssessment.trend,
        //       risk: riskAssessment.score / 100,
        //       updatedAt: new Date()
        //     }
        //   }
        // );
        
        updatedCount++;
      }
      
      return updatedCount;
    } catch (error) {
      console.error('Error recalculating all risks:', error);
      throw error;
    }
  }

  // Private helper methods
 private async fetchEmployees(): Promise<Employee[]> {
  try {
    // Import the Employee model
    const { Employee: EmployeeModel } = await import('../models/employee.model');
    
    // Query MongoDB for all employees
    const employees = await EmployeeModel.find().lean();
    
    console.log(`📊 Fetched ${employees.length} employees from MongoDB`);
    
    return employees as any as Employee[];
  } catch (error) {
    console.error('Error fetching employees from MongoDB:', error);
    return [];
  }
}
 

  // Static helper methods
  private static shouldRecalculateRisk(updateData: Partial<Employee>): boolean {
    const riskRelevantFields = [
      'performanceRating', 'tenure', 'engagementScore', 'compRatio',
      'criticalSkills', 'skillGaps', 'department', 'position'
    ];
    
    return Object.keys(updateData).some(field => 
      riskRelevantFields.includes(field)
    );
  }

  private static getRiskLevel(score: number): 'Low' | 'Medium' | 'High' {
    if (score >= 70) return 'High';
    if (score >= 30) return 'Medium';
    return 'Low';
  }
}

// Export singleton instance for convenience
export const employeeService = new EmployeeService();