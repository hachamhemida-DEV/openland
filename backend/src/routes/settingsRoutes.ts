import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { verifyToken, isAdmin } from '../middleware/authMiddleware';

const router = Router();

// Public - get settings for displaying contact info
router.get('/', getSettings);

// Admin only - update settings
router.put('/', verifyToken, isAdmin, updateSettings);

export default router;
