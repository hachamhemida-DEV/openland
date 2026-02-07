"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Apply middleware to all admin routes
router.use(authMiddleware_1.verifyToken, authMiddleware_1.isAdmin);
router.get('/lands/pending', adminController_1.getPendingLands);
router.get('/lands', adminController_1.getAllLands);
router.put('/lands/:id/verify', adminController_1.verifyLand);
router.put('/lands/:id', adminController_1.updateLand); // Admin edit land
router.delete('/lands/:id', adminController_1.deleteLand);
router.put('/documents/:id/verify', adminController_1.verifyDocument);
router.get('/stats', adminController_1.getDashboardStats);
exports.default = router;
