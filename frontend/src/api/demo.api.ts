// Demo API service - uses mock data or demo backend
const DEMO_API_BASE = 'http://localhost:3001/api/demo';
const DEMO_CREDENTIALS = 'demo:prometheus2025';

// Basic auth headers
const getAuthHeaders = () => {
  const token = btoa(DEMO_CREDENTIALS);
  return {
    'Authorization': `Basic ${token}`,
    'Content-Type': 'application/json'
  };
};

export async function getDemoEmployees() {
  try {
    const res = await fetch(`${DEMO_API_BASE}/employees`, {
      headers: getAuthHeaders()
    });
    
    if (!res.ok) {
      throw new Error(`Demo API error: ${res.status}`);
    }
    
    const data = await res.json();
    return data.data || data; // Handle both wrapped and raw data
  } catch (error) {
    console.error('Demo API failed, using fallback mock data:', error);
    // Fallback mock data
    return [
      {
        id: 'DEMO001',
        name: 'Alex Johnson',
        department: 'Engineering',
        riskScore: 45,
        riskLevel: 'medium'
      },
      {
        id: 'DEMO002',
        name: 'Maria Garcia', 
        department: 'Marketing',
        riskScore: 28,
        riskLevel: 'low'
      }
    ];
  }
}

export async function getDemoHealth() {
  const res = await fetch(`${DEMO_API_BASE}/health`, {
    headers: getAuthHeaders()
  });
  return res.json();
}

// Demo mode check
export const isDemoMode = () => {
  return window.location.search.includes('demo=true') || 
         localStorage.getItem('demoMode') === 'true';
};
