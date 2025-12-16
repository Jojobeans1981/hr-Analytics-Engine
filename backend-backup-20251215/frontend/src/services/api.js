import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = error.response?.data?.error || error.message || 'An error occurred';
    console.error('API Error:', errorMessage);
    return Promise.reject(errorMessage);
  }
);

// Employee API methods
export const employeeAPI = {
  // Get all employees with optional filters
  getAll: (params = {}) => api.get('/employees', { params }),
  
  // Get single employee by ID
  getById: (id) => api.get(`/employees/${id}`),
  
  // Get employee statistics
  getStats: () => api.get('/employees/stats/summary'),
  
  // Get employees by department
  getByDepartment: (department) => api.get(`/employees?department=${department}`),
  
  // Create new employee
  create: (employeeData) => api.post('/employees', employeeData),
  
  // Update employee
  update: (id, employeeData) => api.put(`/employees/${id}`, employeeData),
  
  // Delete employee
  delete: (id) => api.delete(`/employees/${id}`),
  
  // Export employees data
  exportData: (format = 'json') => 
    api.get(`/employees/export?format=${format}`, { responseType: 'blob' })
};

// Health check
export const healthAPI = {
  check: () => api.get('/health')
};

export default api;

// Risk API methods
export const riskAPI = {
  // Calculate risk for an employee
  calculateRisk: (employeeId, data) => api.post(`/risk/calculate/${employeeId}`, data),
  
  // Batch calculate risk scores
  batchCalculate: (data) => api.post('/risk/batch-calculate', data),
  
  // Compare algorithms
  compareAlgorithms: (employeeId, data) => api.post(`/risk/compare-algorithms/${employeeId}`, data),
  
  // Get organization analytics
  getAnalytics: (data) => api.post('/risk/analytics/organization', data),
  
  // Generate risk report
  generateReport: (data) => api.post('/risk/report/generate', data),
  
  // Create custom algorithm
  createCustomAlgorithm: (data) => api.post('/risk/algorithms/custom', data),
  
  // Get available algorithms
  getAlgorithms: () => api.get('/risk/algorithms'),
  
  // Test algorithm
  testAlgorithm: (data) => api.post('/risk/algorithms/test', data),
  
  // Get algorithm config
  getAlgorithmConfig: (name) => api.get(`/risk/algorithms/${name}/config`)
};
