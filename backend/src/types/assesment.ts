export interface assessmentData {
  employeeId: string;
  type: string;
  status: string;
  assessmentDate: Date;
  riskScore: number;
  riskCategory: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}
