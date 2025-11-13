import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateAuthRequest } from '../validations/auth.validation';

const router = Router();

const validateAuth = (req: any, res: any, next: any) => {
  const error = validateAuthRequest(req);
  if (error) {
    res.status(400).json({ success: false, error });
    return;
  }
  next();
};

router.post('/login', validateAuth, AuthController.login);
router.post('/register', validateAuth, AuthController.register);
router.post('/logout', AuthController.logout);
router.post('/refresh', AuthController.refreshToken);

export default router;
