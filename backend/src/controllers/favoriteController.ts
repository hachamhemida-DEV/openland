import { Response } from 'express';
import { Favorite } from '../models/Favorite';
import { Land } from '../models/Land';
import { LandMedia } from '../models/LandMedia';
import { AuthRequest } from '../middleware/authMiddleware';

// Add land to favorites
export const addFavorite = async (req: AuthRequest, res: Response) => {
    try {
        const { land_id } = req.body;
        const userId = req.user.id;

        // Check if already favorited
        const existing = await Favorite.findOne({
            where: { user_id: userId, land_id },
        });

        if (existing) {
            return res.status(400).json({ message: 'Land already in favorites' });
        }

        const favorite = await Favorite.create({
            user_id: userId,
            land_id,
        });

        res.status(201).json({ message: 'Added to favorites', favorite });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// Remove land from favorites
export const removeFavorite = async (req: AuthRequest, res: Response) => {
    try {
        const { land_id } = req.params;
        const userId = req.user.id;

        const favorite = await Favorite.findOne({
            where: { user_id: userId, land_id },
        });

        if (!favorite) {
            return res.status(404).json({ message: 'Favorite not found' });
        }

        await favorite.destroy();
        res.json({ message: 'Removed from favorites' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// Get user's favorites
export const getFavorites = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;

        const favorites = await Favorite.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Land,
                    include: [LandMedia],
                },
            ],
            order: [['created_at', 'DESC']],
        });

        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};
