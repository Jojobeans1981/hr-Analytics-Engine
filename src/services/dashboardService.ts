// src/services/dashboardService.ts
import { api } from '../api/client'; // Import your axios instance
import type { DashboardData } from '../types/dashboard';

export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await api.get('/dashboard/metrics'); // Use axios instance
    return response.data;
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    throw error;
  }
};