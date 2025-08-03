import express from 'express';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthService } from '../services/auth.service';
import { validateRequest } from '../middleware/validation.middleware';
import { loginSchema, registerSchema } from '../validations/auth.validation';
import { User } from '../models/user.model';

const router = express.Router();

// GET auth status
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Authentication endpoint',
    endpoints: {
      login: 'POST /api/auth/login',
      register: 'POST /api/auth/register',
      logout: 'POST /api/auth/logout',
      refresh: 'POST /api/auth/refresh'
    }
  });
});

// POST login
router.post(
  '/login',
  validateRequest(loginSchema),
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { token, user } = await AuthService.login(email, password);
      
      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Authentication failed'
      });
    }
  })
);

// POST register
router.post(
  '/register',
  validateRequest(registerSchema),
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      const userData: Omit<User, '_id'> = {
        email,
        password,
        firstName,
        lastName,
        role: 'user', // Default role
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const user = await AuthService.register(userData);
      
      res.status(201).json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed'
      });
    }
  })
);

export default router;