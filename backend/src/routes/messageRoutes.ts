import { Router } from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import { sendMessage, getConversation, getConversations } from '../controllers/messageController';

const router = Router();

// All routes require authentication
router.use(verifyToken);

router.post('/', sendMessage);
router.get('/', getConversations);
router.get('/:userId', getConversation);

export default router;
