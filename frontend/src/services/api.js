import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Employee API methods
export const employeeAPI = {
  getAll: () => api.get('/api/employees'),
  getById: (id) => api.get(`/api/employees/${id}`),
  getStats: () => api.get('/api/employees/stats/summary'),
  create: (data) => api.post('/api/employees', data),
  update: (id, data) => api.put(`/api/employees/${id}`, data),
  delete: (id) => api.delete(`/api/employees/${id}`)
};

// Risk API methods
export const riskAPI = {
  calculateRisk: (employeeId, data) => api.post(`/api/risk/calculate/${employeeId}`, data),
  batchCalculate: (data) => api.post('/api/risk/batch-calculate', data),
  getAlgorithms: () => api.get('/api/risk/algorithms'),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health')
};

export default api;
