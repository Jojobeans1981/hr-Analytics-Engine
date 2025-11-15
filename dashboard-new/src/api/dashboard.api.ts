// In your dashboard.api.ts or similar file
const API_BASE = 'https://prometheus-talent-engine-production.up.railway.app/api';

export const fetchEmployees = async () => {
  const response = await fetch('/api/employees');
  if (!response.ok) {
    throw new Error(`Failed to fetch employees: ${response.status}`);
  }
  return response.json();
};

export const fetchDashboardMetrics = async () => {
  const response = await fetch('/api/dashboard-metrics');
  if (!response.ok) {
    throw new Error(`Failed to fetch metrics: ${response.status}`);
  }
  return response.json();
};