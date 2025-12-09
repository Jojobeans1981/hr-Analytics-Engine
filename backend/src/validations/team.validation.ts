import { Request } from 'express';

export interface TeamData {
  name: string;
  description?: string;
  managerId?: string;
  memberIds?: string[];
  department?: string;
}

export const validateTeam = (data: any): string | null => {
  if (!data.name?.trim()) return 'Team name is required';
  if (data.name.length < 2) return 'Team name must be at least 2 characters';
  if (data.name.length > 50) return 'Team name must be less than 50 characters';
  return null;
};

export const validateTeamRequest = (req: Request): string | null => {
  return validateTeam(req.body);
};
