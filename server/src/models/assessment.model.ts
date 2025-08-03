import { ObjectId } from 'mongodb';

export interface RiskCategory {
  score: number;
  [key: string]: any;
}

export interface Assessment {
  _id?: ObjectId;
  employeeId: ObjectId;
  assessmentDate: string;
  assessorId: string;
  type: string;
  overallRiskScore: number;
  riskCategories: Record<string, RiskCategory>;
  recommendations: string[];
  notes: string;
  followUpDate?: string | null;
  status: 'pending' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}