const API_BASE_URL = 'https://prometheus-talent-engine-production.up.railway.app/api';

export async function getDashboardMetrics() {
  const res = await fetch(`${API_BASE_URL}/dashboard-metrics`, {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });
  if (!res.ok) {
    throw new Error('Failed to fetch dashboard metrics');
  }
  return res.json();
}

export async function getEmployees() {
  const res = await fetch(`${API_BASE_URL}/employees`, {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });
  if (!res.ok) {
    throw new Error('Failed to fetch employees');
  }
  const data = await res.json();
  return data.employees || [];
}