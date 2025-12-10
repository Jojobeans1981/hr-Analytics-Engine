import { Router, Request, Response } from 'express';

const router = Router();

// Mock user database
const users = [
  {
    id: 1,
    email: 'admin@talentrisk.ai',
    password: 'password123', // In production, use hashed passwords
    name: 'Admin User',
    role: 'admin',
    permissions: ['read', 'write', 'admin']
  },
  {
    id: 2,
    email: 'manager@company.com',
    password: 'manager123',
    name: 'Manager User',
    role: 'manager',
    permissions: ['read', 'write']
  }
];

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Create a mock JWT token (in production, use a real JWT library)
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
      userId: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    }))}.mock-signature`;
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: {
        token,
        user: userWithoutPassword
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
});

// Register endpoint
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and name are required'
      });
    }
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      return res.status(409).json({
        success: false,
        error: 'User already exists'
      });
    }
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      email,
      password, // In production, hash this password
      name,
      role: 'user',
      permissions: ['read']
    };
    
    // In production, save to database
    // await userService.createUser(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      success: true,
      data: userWithoutPassword,
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
});

// Logout endpoint
router.post('/logout', (req: Request, res: Response) => {
  // In production, you might want to invalidate the token
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// Verify token endpoint
router.get('/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'No token provided'
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // In production, verify the actual JWT token
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Mock verification
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    const payload = JSON.parse(atob(tokenParts[1]));
    
    if (payload.exp < Date.now()) {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    }
    
    const user = users.find(u => u.id === payload.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: {
        valid: true,
        user: userWithoutPassword
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

export default router;