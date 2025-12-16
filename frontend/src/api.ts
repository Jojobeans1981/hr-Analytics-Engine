import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
});

// Demo mode detection
const isDemoMode = () => {
  return window.location.search.includes('demo=true') || 
         localStorage.getItem('demoMode') === 'true';
};

// Demo API base
const DEMO_API_BASE = 'http://localhost:3001/api/demo';
const DEMO_CREDENTIALS = 'demo:prometheus2025';

// Demo API instance
const DemoAPI = axios.create({
  baseURL: DEMO_API_BASE,
  auth: {
    username: 'demo',
    password: 'prometheus2025'
  },
  headers: {
    'Content-Type': 'application/json'
  }
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
  if (isDemoMode()) {
    // Return demo summary
    return {
      totalEmployees: 5,
      avgRisk: 42.8,
      departments: {
        'Engineering': 2,
        'Marketing': 1,
        'Sales': 1,
        'HR': 1
      },
      riskLevels: {
        'low': 2,
        'medium': 2,
        'high': 1
      }
    };
  }
  
  const res = await API.get<Summary>("/employees/summary");
  return res.data;
};

export const getEmployees = async (): Promise<Employee[]> => {
  if (isDemoMode()) {
    try {
      const response = await DemoAPI.get("/employees");
      const data = response.data;
      // Handle both response formats
      const employees = data.data || data;
      return Array.isArray(employees) ? employees : [];
    } catch (error) {
      console.error("Demo API failed, using fallback:", error);
      // Fallback mock data
      return [
        {
          _id: 'DEMO001',
          name: 'Alex Johnson',
          email: 'alex.johnson@company.com',
          department: 'Engineering',
          riskScore: 45,
          riskLevel: 'medium'
        },
        {
          _id: 'DEMO002',
          name: 'Maria Garcia',
          email: 'maria.garcia@company.com',
          department: 'Marketing',
          riskScore: 28,
          riskLevel: 'low'
        }
      ];
    }
  }
  
  const res = await API.get<Employee[]>("/employees");
  return res.data;
};

// Toggle demo mode
export const toggleDemoMode = (enabled: boolean) => {
  if (enabled) {
    localStorage.setItem('demoMode', 'true');
    window.location.search = 'demo=true';
  } else {
    localStorage.removeItem('demoMode');
    window.location.search = '';
  }
  window.location.reload();
};

// Check current mode
export const checkDemoMode = (): boolean => {
  return isDemoMode();
};
