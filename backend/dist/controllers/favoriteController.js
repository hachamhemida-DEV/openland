"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFavorites = exports.removeFavorite = exports.addFavorite = void 0;
const Favorite_1 = require("../models/Favorite");
const Land_1 = require("../models/Land");
const LandMedia_1 = require("../models/LandMedia");
// Add land to favorites
const addFavorite = async (req, res) => {
    try {
        const { land_id } = req.body;
        const userId = req.user.id;
        // Check if already favorited
        const existing = await Favorite_1.Favorite.findOne({
            where: { user_id: userId, land_id },
        });
        if (existing) {
            return res.status(400).json({ message: 'Land already in favorites' });
        }
        const favorite = await Favorite_1.Favorite.create({
            user_id: userId,
            land_id,
        });
        res.status(201).json({ message: 'Added to favorites', favorite });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.addFavorite = addFavorite;
// Remove land from favorites
const removeFavorite = async (req, res) => {
    try {
        const { land_id } = req.params;
        const userId = req.user.id;
        const favorite = await Favorite_1.Favorite.findOne({
            where: { user_id: userId, land_id },
        });
        if (!favorite) {
            return res.status(404).json({ message: 'Favorite not found' });
        }
        await favorite.destroy();
        res.json({ message: 'Removed from favorites' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.removeFavorite = removeFavorite;
// Get user's favorites
const getFavorites = async (req, res) => {
    try {
        const userId = req.user.id;
        const favorites = await Favorite_1.Favorite.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Land_1.Land,
                    include: [LandMedia_1.LandMedia],
                },
            ],
            order: [['created_at', 'DESC']],
        });
        res.json(favorites);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getFavorites = getFavorites;
