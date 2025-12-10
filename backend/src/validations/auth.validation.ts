import { Request } from 'express';

export interface AuthData {
  email: string;
  password: string;
}

export const validateAuth = (data: any): string | null => {
  if (!data.email) return 'Email is required';
  if (!data.password) return 'Password is required';
  if (!/\S+@\S+\.\S+/.test(data.email)) return 'Valid email is required';
  return null;
};

export const validateAuthRequest = (req: Request): string | null => {
  return validateAuth(req.body);
};
