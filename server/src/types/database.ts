export interface Employee {
  _id: string;
  name: string;
  department: string;
  position: string;
  riskScore: number;
  skills: string[];
}

export interface RiskAssessment {
  _id: string;
  employeeId: string;
  assessmentDate: Date;
  riskFactors: {
    engagement: number;
    compensation: number;
    marketDemand: number;
    tenure: number;
  };
  overallRisk: number;
}

export interface PerformanceReview {
  _id: string;
  employeeId: string;
  reviewDate: Date;
  overallRating: number;
}

export interface SkillInventory {
  _id: string;
  skillName: string;
  employeesCertified: string[];
}