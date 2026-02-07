import { Router } from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import { addFavorite, removeFavorite, getFavorites } from '../controllers/favoriteController';

const router = Router();

// All routes require authentication
router.use(verifyToken);

router.post('/', addFavorite);
router.delete('/:land_id', removeFavorite);
router.get('/', getFavorites);

export default router;
