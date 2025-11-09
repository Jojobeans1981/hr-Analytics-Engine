export interface DashboardData {
  metrics: {
    totalEmployees: number;
    highRiskCount: number;
    assessmentsCount: number;
    skillsCount: number;
  };
  recentAssessments: {
    _id: string;
    employeeName: string;
    riskScore: number;
    date: string;
  }[];
}