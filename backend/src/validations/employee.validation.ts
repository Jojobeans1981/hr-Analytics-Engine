import { Request } from 'express';

export interface EmployeeData {
  name: string;
  email: string;
  position: string;
  department: string;
  skills: string[];
}

export const validateEmployee = (data: any): string | null => {
  if (!data.name?.trim()) return 'Name is required';
  if (!data.email) return 'Email is required';
  if (!data.position) return 'Position is required';
  if (!data.department) return 'Department is required';
  if (!/\S+@\S+\.\S+/.test(data.email)) return 'Valid email is required';
  return null;
};

export const validateEmployeeRequest = (req: Request): string | null => {
  return validateEmployee(req.body);
};
