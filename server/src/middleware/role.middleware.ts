import { Request, Response, NextFunction } from 'express';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {       
  // @ts-ignore - user will be attached by auth middleware
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Admin access required' });
};

export const requireManager = (req: Request, res: Response, next: NextFunction) => {    
  // @ts-ignore - user will be attached by auth middleware
  if (req.user && (req.user.role === 'manager' || req.user.role === 'admin')) {
    return next();
  }
  return res.status(403).json({ error: 'Manager access required' });
};
