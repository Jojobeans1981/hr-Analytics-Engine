// src/types/dashboard.ts
export interface DashboardData {
  metrics: {
    highRiskCount: number;
    totalEmployees: number;
    averageRiskScore: number;
    // Add other metrics as needed
  };
  recentActivities: Array<{
    id: string;
    name: string;
    riskScore: number;
    date: string;
  }>;
  riskDistribution?: {
    labels: string[];
    values: number[];
  };
}