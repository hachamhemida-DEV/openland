import { Request, Response } from 'express';
import { Land, LandStatus } from '../models/Land';
import { Document } from '../models/Document';
import { User } from '../models/User';

export const getPendingLands = async (req: Request, res: Response) => {
    try {
        const lands = await Land.findAll({
            where: { status: LandStatus.PENDING },
            include: [
                { model: User, as: 'owner' },
                Document
            ],
            order: [['created_at', 'ASC']],
        });
        res.json(lands);
    } catch (error) {
        console.error('[getPendingLands] Error:', error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

export const verifyLand = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, rejection_reason } = req.body; // 'verified' or 'rejected' + optional reason

        if (![LandStatus.VERIFIED, LandStatus.REJECTED].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const land = await Land.findByPk(id);
        if (!land) return res.status(404).json({ message: 'Land not found' });

        land.status = status;

        // Store rejection reason if rejected
        if (status === LandStatus.REJECTED && rejection_reason) {
            land.rejection_reason = rejection_reason;
        } else if (status === LandStatus.VERIFIED) {
            land.rejection_reason = undefined; // Clear if now verified
        }

        await land.save();

        // Notify land owner
        try {
            const { Notification, NotificationType } = require('../models/Notification');

            const title = status === LandStatus.VERIFIED ? 'تمت الموافقة على عقارك' : 'تم رفض عقارك';
            let message = status === LandStatus.VERIFIED
                ? `تمت الموافقة على عقارك "${land.title}" وأصبح معروضاً للجميع`
                : `تم رفض عقارك "${land.title}".`;

            // Add rejection reason to notification message
            if (status === LandStatus.REJECTED && rejection_reason) {
                message += ` السبب: ${rejection_reason}`;
            }

            const type = status === LandStatus.VERIFIED ? NotificationType.LAND_VERIFIED : NotificationType.LAND_REJECTED;

            await Notification.create({
                user_id: land.owner_id,
                type,
                title,
                message,
                related_land_id: land.id,
            });
        } catch (notifError) {
            console.error('Failed to create notification:', notifError);
        }

        res.json({ message: `Land ${status} successfully`, land });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

export const verifyDocument = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { is_verified } = req.body;

        const document = await Document.findByPk(id);
        if (!document) return res.status(404).json({ message: 'Document not found' });

        document.is_verified = is_verified;
        document.verified_at = new Date();
        await document.save();

        res.json({ message: 'Document updated', document });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.count();
        const totalLands = await Land.count();
        const pendingLands = await Land.count({ where: { status: LandStatus.PENDING } });
        const verifiedLands = await Land.count({ where: { status: LandStatus.VERIFIED } });

        res.json({
            totalUsers,
            totalLands,
            pendingLands,
            verifiedLands,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

export const getAllLands = async (req: Request, res: Response) => {
    try {
        const { search } = req.query;
        let whereClause: any = {};

        if (search && typeof search === 'string' && search.trim()) {
            const { Op } = require('sequelize');
            whereClause = {
                [Op.or]: [
                    { title: { [Op.iLike]: `%${search}%` } },
                    { wilaya: { [Op.iLike]: `%${search}%` } },
                    { baladia: { [Op.iLike]: `%${search}%` } },
                ]
            };
        }

        const lands = await Land.findAll({
            where: whereClause,
            include: [{ model: User, as: 'owner' }],
            order: [['created_at', 'DESC']],
        });

        res.json(lands);
    } catch (error) {
        console.error('[getAllLands] Error:', error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

export const deleteLand = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const land = await Land.findByPk(id);
        if (!land) return res.status(404).json({ message: 'Land not found' });

        await land.destroy();

        res.json({ message: 'Land deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// Admin can edit any land
export const updateLand = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, price, area_m2, type, service_type, wilaya, baladia } = req.body;

        const land = await Land.findByPk(id);
        if (!land) return res.status(404).json({ message: 'Land not found' });

        // Update only provided fields
        if (title) land.title = title;
        if (description) land.description = description;
        if (price) land.price = parseFloat(price);
        if (area_m2) land.area_m2 = parseFloat(area_m2);
        if (type) land.type = type;
        if (service_type) land.service_type = service_type;
        if (wilaya) land.wilaya = wilaya;
        if (baladia) land.baladia = baladia;

        await land.save();

        res.json({ message: 'Land updated successfully', land });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};
