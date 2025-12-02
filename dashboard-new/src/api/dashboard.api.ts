const API_BASE_URL = 'https://prometheus-talent-engine-production.up.railway.app/api';

export async function getDashboardMetrics() {
  const res = await fetch(`${API_BASE_URL}/risk/dashboard`, { 
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
  const res = await fetch(`${API_BASE_URL}/risk/employees`, { 
    headers: {
      'Cache-Control': 'no-cache', 
      'Pragma': 'no-cache'
    }
  });
  if (!res.ok) {
    throw new Error('Failed to fetch employees');
  }
  return res.json(); 
}


export async function getHighRiskAlerts() {
  const res = await fetch(`${API_BASE_URL}/risk/alerts/high-risk`, {
    headers: {
      'Cache-Control': 'no-cache',
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
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });
  if (!res.ok) {
    throw new Error('Failed to trigger risk analysis');
  }
  return res.json();
}