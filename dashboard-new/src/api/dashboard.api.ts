const RAILWAY_BASE = 'https://prometheus-talent-engine-production.up.railway.app';

export const fetchEmployees = async () => {
  const response = await fetch(`${RAILWAY_BASE}/api/employees`); // Direct to Railway
  if (!response.ok) {
    throw new Error(`Failed to fetch employees: ${response.status}`);
  }
  return response.json();
};

export const fetchDashboardMetrics = async () => {
  const response = await fetch(`${RAILWAY_BASE}/api/dashboard-metrics`); // Direct to Railway
  if (!response.ok) {
    throw new Error(`Failed to fetch metrics: ${response.status}`);
  }
  return response.json();
};