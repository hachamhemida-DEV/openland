import { Router } from 'express';
import { createLand, getLands, getLandById, getLandByIdForAdmin, getMyLands, updateMyLand } from '../controllers/landController';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware';
import { upload } from '../config/multer';
import { validateLandCreation, validateSearch } from '../middleware/validators';
import { createLandLimiter } from '../middleware/rateLimiter';

const router = Router();

// Accept images, documents, and videos
router.post('/', verifyToken, createLandLimiter, upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'documents', maxCount: 5 },
    { name: 'videos', maxCount: 2 }
]), validateLandCreation, createLand);

router.get('/', validateSearch, getLands);
router.get('/my-lands', verifyToken, getMyLands);

// User update their own land (with optional file uploads)
router.put('/my-lands/:id', verifyToken, upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'documents', maxCount: 5 },
    { name: 'videos', maxCount: 2 }
]), updateMyLand);

// Admin route - get land with full seller info
router.get('/admin/:id', verifyToken, requireAdmin, getLandByIdForAdmin);

// Public route - no seller info (admin is intermediary)
router.get('/:id', getLandById);

export default router;
