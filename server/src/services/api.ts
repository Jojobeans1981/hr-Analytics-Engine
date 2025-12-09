// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

export interface DashboardData {
  metrics: {
    highRiskCount: number;
    totalEmployees: number;
    averageRiskScore: number;
  };
  recentActivities: Array<{
    id: string;
    name: string;
    riskScore: number;
    date: string;
  }>;
}

export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};