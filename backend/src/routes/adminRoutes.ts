import { Router } from 'express';
import { getPendingLands, verifyLand, verifyDocument, getDashboardStats, deleteLand, getAllLands, updateLand } from '../controllers/adminController';
import { verifyToken, isAdmin } from '../middleware/authMiddleware';

const router = Router();

// Apply middleware to all admin routes
router.use(verifyToken, isAdmin);

router.get('/lands/pending', getPendingLands);
router.get('/lands', getAllLands);
router.put('/lands/:id/verify', verifyLand);
router.put('/lands/:id', updateLand);  // Admin edit land
router.delete('/lands/:id', deleteLand);
router.put('/documents/:id/verify', verifyDocument);
router.get('/stats', getDashboardStats);

export default router;
