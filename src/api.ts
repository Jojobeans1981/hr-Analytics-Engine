import axios from "axios";

// Base URL from environment
const API_BASE = process.env.REACT_APP_API_BASE_URL || "https://hr-analytics-engine.onrender.com";

// Main API instance
const API = axios.create({
  baseURL: API_BASE,
});

// Demo mode detection
const isDemoMode = () => {
  return window.location.search.includes('demo=true') || 
         localStorage.getItem('demoMode') === 'true';
};

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

// Helper to add basic auth for demo endpoints
const getDemoConfig = () => {
  const token = btoa('demo:prometheus2025');
  return {
    headers: {
      'Authorization': `Basic ${token}`
    }
  };
};

// --- Calls ---
export const getSummary = async (): Promise<Summary> => {
  if (isDemoMode()) {
    // For demo, we might not have a demo summary endpoint
    // Return mock summary based on demo employees
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
  
  const res = await API.get<Summary>("/api/employees/summary");
  return res.data;
};

export const getEmployees = async (): Promise<Employee[]> => {
  if (isDemoMode()) {
    try {
      // Call demo endpoint with basic auth
      const response = await API.get("/api/demo/employees", getDemoConfig());
      const data = response.data;
      // Handle response format
      const employees = data.data || data;
      return Array.isArray(employees) ? employees : [];
    } catch (error) {
      console.error("Demo API failed:", error);
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
  
  const res = await API.get<Employee[]>("/api/employees");
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
