import axios from "axios";


const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
});

// --- Types ---
export type Employee = {
  _id: string;
  name: string;
  email: string;
  department: string;
  riskScore: number;
  riskLevel?: string;
};

export type Summary = {
  totalEmployees: number;
  avgRisk: number;
  departments: Record<string, number>;
  riskLevels: Record<string, number>;
};

// --- Calls ---
export const getSummary = async (): Promise<Summary> => {
  const res = await API.get<Summary>("/employees/summary");
  return res.data;
};

export const getEmployees = async (): Promise<Employee[]> => {
  const res = await API.get<{ success: boolean; employees: Employee[] }>(
    "/employees"
  );
  return res.data.employees;
};