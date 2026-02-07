"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settingsController_1 = require("../controllers/settingsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public - get settings for displaying contact info
router.get('/', settingsController_1.getSettings);
// Admin only - update settings
router.put('/', authMiddleware_1.verifyToken, authMiddleware_1.isAdmin, settingsController_1.updateSettings);
exports.default = router;
