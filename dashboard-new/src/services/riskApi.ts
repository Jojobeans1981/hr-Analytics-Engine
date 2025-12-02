// frontend/src/services/riskApi.ts
const API_BASE = '/api/risk';

export interface Employee {
  _id: string;
  name: string;
  department: string;
  role: string;
  balancedRiskScore: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'MINIMAL';
  riskFactors: string[];
  positiveFactors: string[];
  confidenceScore: number;
  tenure: number;
  performanceScore: number;
  engagementScore: number;
}

export interface DashboardSummary {
  totalEmployees: number;
  riskDistribution: {
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
    minimalRisk: number;
  };
  departments: {
    [key: string]: {
      total: number;
      highRisk: number;
      avgRisk: string;
    };
  };
  lastUpdated: string;
}

export const riskApi = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    const response = await fetch(`${API_BASE}/dashboard/summary`);
    if (!response.ok) throw new Error('Failed to fetch dashboard summary');
    return response.json();
  },

  async getHighRiskEmployees(): Promise<Employee[]> {
    const response = await fetch(`${API_BASE}/employees/high-risk`);
    if (!response.ok) throw new Error('Failed to fetch high risk employees');
    return response.json();
  },

  async getAllEmployees(): Promise<Employee[]> {
    const response = await fetch(`${API_BASE}/employees`);
    if (!response.ok) throw new Error('Failed to fetch employees');
    return response.json();
  },

  async recalculateRiskScores(): Promise<{ message: string; status: string }> {
    const response = await fetch(`${API_BASE}/risk/recalculate`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to recalculate risk scores');
    return response.json();
  },
};