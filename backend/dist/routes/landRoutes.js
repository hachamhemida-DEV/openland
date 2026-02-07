"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const landController_1 = require("../controllers/landController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const multer_1 = require("../config/multer");
const validators_1 = require("../middleware/validators");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
// Accept images, documents, and videos
router.post('/', authMiddleware_1.verifyToken, rateLimiter_1.createLandLimiter, multer_1.upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'documents', maxCount: 5 },
    { name: 'videos', maxCount: 2 }
]), validators_1.validateLandCreation, landController_1.createLand);
router.get('/', validators_1.validateSearch, landController_1.getLands);
router.get('/my-lands', authMiddleware_1.verifyToken, landController_1.getMyLands);
// User update their own land (with optional file uploads)
router.put('/my-lands/:id', authMiddleware_1.verifyToken, multer_1.upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'documents', maxCount: 5 },
    { name: 'videos', maxCount: 2 }
]), landController_1.updateMyLand);
// Admin route - get land with full seller info
router.get('/admin/:id', authMiddleware_1.verifyToken, authMiddleware_1.requireAdmin, landController_1.getLandByIdForAdmin);
// Public route - no seller info (admin is intermediary)
router.get('/:id', landController_1.getLandById);
exports.default = router;
