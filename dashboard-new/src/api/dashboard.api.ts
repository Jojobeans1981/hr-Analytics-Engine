export async function getDashboardMetrics() {
  const res = await fetch('/api/dashboard-metrics', {
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
  const res = await fetch('/api/employees', {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });
  if (!res.ok) {
    throw new Error('Failed to fetch employees');
  }
   const data = await res.json();
  // Extract the employees array from the response
  return data.employees || [];
}