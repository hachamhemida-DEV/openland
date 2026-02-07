"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const messageController_1 = require("../controllers/messageController");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(authMiddleware_1.verifyToken);
router.post('/', messageController_1.sendMessage);
router.get('/', messageController_1.getConversations);
router.get('/:userId', messageController_1.getConversation);
exports.default = router;
