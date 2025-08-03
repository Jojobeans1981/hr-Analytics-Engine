import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  [key: string]: any;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Uncomment for production
  // const authHeader = req.headers['authorization'];
  // const token = authHeader && authHeader.split(' ')[1];
  
  // if (!token) return res.status(401).json({ error: 'Access token required' });

  // jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
  //   if (err) return res.status(403).json({ error: 'Invalid token' });
  //   req.user = user as UserPayload;
  //   next();
  // });

  // Temporary bypass for development
  req.user = { id: 'test-user' };
  next();
};

export const authorizeRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
    }
    next();
  };
};