export interface Employee {
  _id: string;
  name: string;
  email: string;
  department: string;
  riskScore: number;
  riskLevel: "Low" | "Medium" | "High";
  position?: string;
  hireDate?: Date;
  lastEvaluation?: Date;
}

export interface CreateEmployeeDto {
  name: string;
  email: string;
  department: string;
  position?: string;
  hireDate?: Date;
}

export interface UpdateEmployeeDto {
  name?: string;
  email?: string;
  department?: string;
  position?: string;
  riskScore?: number;
  riskLevel?: "Low" | "Medium" | "High";
}