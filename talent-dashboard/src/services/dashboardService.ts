import type { DashboardData } from '../types/dashboard';

export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await fetch('/api/dashboard/metrics');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    throw error;
  }
};