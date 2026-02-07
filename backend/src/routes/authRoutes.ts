import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { verifyToken } from '../middleware/authMiddleware';
import { validateRegistration, validateLogin } from '../middleware/validators';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, validateRegistration, register);
router.post('/login', authLimiter, validateLogin, login);
router.get('/profile', verifyToken, getProfile);

export default router;
