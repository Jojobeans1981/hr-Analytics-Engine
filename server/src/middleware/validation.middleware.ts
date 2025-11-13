import { Request, Response, NextFunction } from 'express';

export const validationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if ((req.method === 'POST' || req.method === 'PUT') && !req.body) {
    res.status(400).json({ success: false, error: 'Request body is required' });
    return;
  }
  next();
};
