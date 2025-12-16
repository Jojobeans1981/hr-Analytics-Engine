import { getDemoEmployees, isDemoMode } from './demo.api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

export async function getEmployees() {
  if (isDemoMode()) {
    const employees = await getDemoEmployees();
    return { employees, demo: true };
  }
  
  const res = await fetch(`${API_BASE_URL}/risk/employees`, {
    headers: { 'Pragma': 'no-cache' }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch employees');
  }
  
  const data = await res.json();
  
  if (Array.isArray(data)) {
    return { employees: data };
  }

  return data;
}

export async function getDashboardMetrics() {
  const res = await fetch(`${API_BASE_URL}/risk/dashboard`, {
    headers: { 'Pragma': 'no-cache' }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch dashboard metrics');
  }
  
  return res.json();
}

export const toggleDemoMode = (enabled) => {
  if (enabled) {
    localStorage.setItem('demoMode', 'true');
    window.location.search = 'demo=true';
  } else {
    localStorage.removeItem('demoMode');
    window.location.search = '';
  }
  window.location.reload();
};
