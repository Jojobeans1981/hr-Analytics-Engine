const API_BASE_URL = 'https://prometheus-talent-engine-production.up.railway.app/api';

export async function getDashboardMetrics() {
  const res = await fetch(`${API_BASE_URL}/risk/dashboard`, { 
    headers: {
      'Pragma': 'no-cache'
    }
  });
  if (!res.ok) {
    throw new Error('Failed to fetch dashboard metrics');
  }
  return res.json();
}

export async function getEmployees() {
  const res = await fetch(`${API_BASE_URL}/risk/employees`, { 
    headers: {
      'Pragma': 'no-cache'
    }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch employees');
  }

  const data = await res.json();

  // Backend returns a raw array; wrap it so the rest of the app
  // can safely use data.employees.
  if (Array.isArray(data)) {
    return { employees: data };
  }

  return data; // if you later change the API to return an object
}

export async function getHighRiskAlerts() {
  const res = await fetch(`${API_BASE_URL}/risk/alerts/high-risk`, {
    headers: {
      'Pragma': 'no-cache'
    }
  });
  if (!res.ok) {
    throw new Error('Failed to fetch high risk alerts');
  }
  return res.json();
}

export async function triggerRiskAnalysis() {
  const res = await fetch(`${API_BASE_URL}/risk/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Pragma': 'no-cache'
    }
  });
  if (!res.ok) {
    throw new Error('Failed to trigger risk analysis');
  }
  return res.json();
}