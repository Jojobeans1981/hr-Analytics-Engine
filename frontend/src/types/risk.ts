// src/types/risk.ts
export interface EnhancedRiskAssessment {
  enhancedRiskScore: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'MINIMAL';
  riskFactors: string[];
  lastUpdated: Date;
  confidenceScore?: number;
}

export interface Employee {
  _id: string;
  employeeId: string;
  name: string;
  department: string;
  role: string;
  tenure: number;
  performanceScore: number;
  engagementScore: number;
  lastPromotion?: string;
  email: string;
  riskScore?: number;
  riskLevel?: string;
  riskFactors?: string[];
  // Enhanced risk fields (added by our scoring)
  enhancedRiskScore?: number;
  lastRiskUpdate?: Date;
  confidenceScore?: number;
}

export interface DepartmentStats {
  total: number;
  highRisk: number;
  totalRisk: number;
  avgRiskScore: number;
  employees: Employee[];
}

export interface RiskDistribution {
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  minimalRisk: number;
}

// Type for DepartmentRiskChart component
export interface DepartmentData {
  [key: string]: {
    total: number;
    highRisk: number;
    avgRisk: string; // Formatted as percentage string
  };
}