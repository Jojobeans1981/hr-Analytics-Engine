import { getDemoEmployees, isDemoMode } from './demo.api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const demoMode = isDemoMode();
  
  if (demoMode && url.includes('/employees')) {
    // Use demo API for employees in demo mode
    const employees = await getDemoEmployees();
    return { employees, demo: true };
  }
  
  // Original fetch logic for non-demo or other endpoints
  const res = await fetch(url, {
    ...options,
    headers: {
      'Pragma': 'no-cache',
      ...options.headers
    }
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch from ${url}`);
  }
  
  return res.json();
}

export async function getDashboardMetrics() {
  const res = await fetchWithAuth(`${API_BASE_URL}/risk/dashboard`);
  return res;
}

export async function getEmployees() {
  const demoMode = isDemoMode();
  
  if (demoMode) {
    const employees = await getDemoEmployees();
    return { employees, demo: true };
  }
  
  const res = await fetchWithAuth(`${API_BASE_URL}/risk/employees`);
  
  const data = await res;

  // Backend returns a raw array; wrap it so the rest of the app
  // can safely use data.employees.
  if (Array.isArray(data)) {
    return { employees: data };
  }

  return data;
}

export async function getHighRiskAlerts() {
  const res = await fetchWithAuth(`${API_BASE_URL}/risk/alerts/high-risk`);
  return res;
}

// Toggle demo mode
export const toggleDemoMode = (enabled: boolean) => {
  if (enabled) {
    localStorage.setItem('demoMode', 'true');
    window.location.search = 'demo=true';
  } else {
    localStorage.removeItem('demoMode');
    window.location.search = '';
  }
};
