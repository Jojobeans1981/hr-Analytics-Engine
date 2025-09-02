import axios from 'axios';
import { HandleApiError } from '../errors/apiError.js';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface DashboardData {
  metrics: {
    highRiskCount: number;
    totalEmployees: number;
    averageRiskScore: number;
    teamHealthIndex: number;
  };
  recentActivities: Array<{
    id: string;
    name: string;
    riskScore: number;
    date: string;
    change?: number;
  }>;
  upcomingReviews: string[];
}

export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const { data } = await api.get('/dashboard');
    return data;
  } catch (error: unknown) {
    throw new HandleApiError(error);
  }
};

export const refreshData = async (): Promise<DashboardData> => {
  try {
    const { data } = await api.get('/dashboard/refresh');
    return data;
  } catch (error: unknown) {
    throw new HandleApiError(error);
  }
};