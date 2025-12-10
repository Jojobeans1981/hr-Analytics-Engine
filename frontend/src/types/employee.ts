export interface Employee {
  _id: string; // Converted from ObjectId
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  email?: string | null;
  status: 'active' | 'on_leave' | 'terminated';
  hireDate: string | Date; // String for display, Date for forms
  createdAt?: string; // Optional in frontend
  updatedAt?: string; // Optional in frontend
  manager?: {
    id: string; // Converted from ObjectId
    name: string;
  };
  skills?: string[];
}

/**
 * Employee form type - for create/edit forms
 * Omits server-generated fields
 */
export type EmployeeFormData = Omit<Employee, 
  '_id' | 'createdAt' | 'updatedAt'
> & {
  _id?: string; // Optional for updates
};

/**
 * Department type - derived from employee data
 */
export type Department = {
  name: string;
  count: number;
  riskPercentage: number;
};

/**
 * Employee status counts for dashboard metrics
 */
export type EmployeeStatusCounts = {
  active: number;
  on_leave: number;
  terminated: number;
};

/**
 * Type guard for Employee
 */
export function isEmployee(obj: unknown): obj is Employee {
  return (
    typeof obj === 'object' && 
    obj !== null &&
    'firstName' in obj && 
    'lastName' in obj &&
    'department' in obj
  );
}