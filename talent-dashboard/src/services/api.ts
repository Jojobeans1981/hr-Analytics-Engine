import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  teamId: string;
  startDate: string;
  location: string;
  riskScore: number;
  riskFactors: {
    flightRisk: string;
    performanceRisk: string;
    engagementRisk: string;
  };
  skills: string[];
  manager: string;
  lastAssessmentDate: string;
  status: string;
}

export interface Assessment {
  id: string;
  employeeId: string;
  assessmentDate: string;
  assessorId: string;
  type: string;
  overallRiskScore: number;
  riskCategories: {
    flightRisk: {
      score: number;
      factors: Array<{
        factor: string;
        weight: number;
        score: number;
      }>;
    };
    performanceRisk: {
      score: number;
      factors: Array<{
        factor: string;
        weight: number;
        score: number;
      }>;
    };
    engagementRisk: {
      score: number;
      factors: Array<{
        factor: string;
        weight: number;
        score: number;
      }>;
    };
  };
  recommendations: string[];
  notes: string;
  followUpDate: string;
  status: string;
  employee?: {
    id: string;
    name: string;
    department: string;
    position: string;
  };
}

export interface Team {
  id: string;
  name: string;
  department: string;
  managerId: string;
  memberCount: number;
  avgRiskScore: number;
  location: string;
  status: string;
}

export interface AssessmentStats {
  totalAssessments: number;
  completedAssessments: number;
  inProgressAssessments: number;
  riskDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  averageRiskScore: string;
  assessmentTypes: {
    quarterly: number;
    annual: number;
    probation: number;
    urgent: number;
  };
}

// API Response types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

// Services
export const employeeService = {
  getAll: () => api.get<ApiResponse<Employee[]>>('/employees'),
  getById: (id: string) => api.get<ApiResponse<Employee>>(`/employees/${id}`),
  create: (data: Partial<Employee>) => api.post<ApiResponse<Employee>>('/employees', data),
  update: (id: string, data: Partial<Employee>) => api.put<ApiResponse<Employee>>(`/employees/${id}`, data),
};

export const assessmentService = {
  getAll: () => api.get<ApiResponse<Assessment[]>>('/assessments'),
  getById: (id: string) => api.get<ApiResponse<Assessment>>(`/assessments/${id}`),
  getByEmployee: (employeeId: string) => api.get<ApiResponse<Assessment[]>>(`/assessments/employee/${employeeId}`),
  getStats: () => api.get<ApiResponse<AssessmentStats>>('/assessments/stats/summary'),
  create: (data: Partial<Assessment>) => api.post<ApiResponse<Assessment>>('/assessments', data),
};

export const teamService = {
  getAll: () => api.get<ApiResponse<Team[]>>('/teams'),
  getById: (id: string) => api.get<ApiResponse<Team>>(`/teams/${id}`),
  getRiskAnalysis: (id: string) => api.get(`/teams/${id}/risk-analysis`),
};