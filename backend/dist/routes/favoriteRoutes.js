"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const favoriteController_1 = require("../controllers/favoriteController");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(authMiddleware_1.verifyToken);
router.post('/', favoriteController_1.addFavorite);
router.delete('/:land_id', favoriteController_1.removeFavorite);
router.get('/', favoriteController_1.getFavorites);
exports.default = router;
