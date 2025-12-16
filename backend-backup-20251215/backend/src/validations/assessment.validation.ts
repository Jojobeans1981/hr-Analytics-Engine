import { Request } from 'express';

export interface AssessmentData {
  teamId: string;
  assessorId: string;
  scores: Record<string, number>;
  comments?: string;
}

export const validateAssessment = (data: any): string | null => {
  if (!data.teamId) return 'Team ID is required';
  if (!data.assessorId) return 'Assessor ID is required';
  if (!data.scores || typeof data.scores !== 'object') return 'Scores are required';
  return null;
};

export const validateAssessmentRequest = (req: Request): string | null => {
  return validateAssessment(req.body);
};
