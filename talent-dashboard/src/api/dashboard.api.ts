// GET dashboard metrics from your backend
export async function getDashboardMetrics() {
  // If you're using a proxy, keep the path as-is.
  // If not, use the full backend URL (e.g. http://localhost:5000/api...)
  const res = await fetch('/api/dashboard-metrics');
  if (!res.ok) {
    throw new Error('Failed to fetch dashboard metrics');
  }
  return res.json();
}

// GET employees from your backend
export async function getEmployees() {
  const res = await fetch('/api/employees');
  if (!res.ok) {
    throw new Error('Failed to fetch employees');
  }
  return res.json();
}