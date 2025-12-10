export interface EmployeeFilterParams {
  department?: string;
  status?: string;
  riskScore?: {
    min?: number;
    max?: number;
  };
}

export interface Employee {
  _id: string;
  name: string;
  department: string;
  status: string;
  riskScore: number;
  // ... other fields
}