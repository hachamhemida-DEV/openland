import { Request, Response } from 'express';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { Land, LandStatus, LandType, ServiceType } from '../models/Land';
import { User } from '../models/User';
import { LandMedia, MediaType } from '../models/LandMedia';
import { Document as LandDocument } from '../models/Document';
import { AuthRequest } from '../middleware/authMiddleware';
import { optimizeImage } from '../utils/imageOptimizer';

export const createLand = async (req: AuthRequest, res: Response) => {
    console.log('Received createLand request');
    console.log('Body:', req.body);
    console.log('Files:', (req as any).files);
    try {
        const { title, description, price, area_m2, type, service_type, wilaya, baladia, lat, lng, phone, email } = req.body;
        const userId = req.user.id;

        console.log(`[createLand] Starting creation for user: ${userId}`);

        // Update user's phone if provided
        if (phone) {
            const user = await User.findByPk(userId);
            if (user && !user.phone) {
                user.phone = phone;
                await user.save();
                console.log(`[createLand] Updated user phone`);
            }
        }

        // Create Land
        console.log(`[createLand] Creating database record...`);
        const land = await Land.create({
            owner_id: userId,
            title,
            description,
            price: parseFloat(price),
            area_m2: parseFloat(area_m2),
            type,
            service_type: service_type || ServiceType.SALE,
            wilaya,
            baladia,
            contact_phone: phone || null,
            contact_email: email || null,
            geom: lat && lng ? { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] } : null,
            status: LandStatus.PENDING,
        });
        console.log(`[createLand] Land created with ID: ${land.id}`);

        // Handle Images
        const files = (req as any).files;
        if (files && files.images) {
            console.log(`[createLand] Processing ${files.images.length} images...`);
            for (const [index, file] of files.images.entries()) {
                console.log(`[createLand] processing image ${index + 1}/${files.images.length}: ${file.filename}`);
                // Optimize image
                const optimizedFilename = await optimizeImage(
                    file.path,
                    file.filename,
                    file.destination
                );

                await LandMedia.create({
                    land_id: land.id,
                    url: `/uploads/images/${optimizedFilename}`,
                    media_type: MediaType.IMAGE,
                    order: index,
                });
            }
            console.log(`[createLand] All images processed.`);
        }

        // Handle Videos
        if (files && files.videos) {
            console.log(`[createLand] Processing ${files.videos.length} videos...`);
            for (const [index, file] of files.videos.entries()) {
                await LandMedia.create({
                    land_id: land.id,
                    url: `/uploads/videos/${file.filename}`,
                    media_type: MediaType.VIDEO,
                    order: index,
                });
            }
        }

        // Handle Documents (ownership papers)
        if (files && files.documents) {
            console.log(`[createLand] Processing ${files.documents.length} documents...`);
            for (const file of files.documents) {
                await LandDocument.create({
                    land_id: land.id,
                    url: `/uploads/documents/${file.filename}`,
                    doc_type: 'ownership_deed',
                    is_verified: false,
                });
            }
        }

        console.log(`[createLand] Request completed successfully.`);
        res.status(201).json({ message: 'Land created successfully', land });
    } catch (error) {
        console.error('[createLand] Fatal error:', error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

export const getLands = async (req: Request, res: Response) => {
    try {
        const { wilaya, baladia, type, service_type, minPrice, maxPrice, minArea, maxArea, lat, lng, radius } = req.query;
        const whereClause: any = { status: LandStatus.VERIFIED };

        // Text Filters
        if (wilaya) whereClause.wilaya = { [Op.iLike]: `%${wilaya}%` };
        if (baladia) whereClause.baladia = { [Op.iLike]: `%${baladia}%` };
        if (type) whereClause.type = type;
        if (service_type) whereClause.service_type = service_type;

        // Range Filters
        if (minPrice || maxPrice) {
            whereClause.price = {};
            if (minPrice) whereClause.price[Op.gte] = minPrice;
            if (maxPrice) whereClause.price[Op.lte] = maxPrice;
        }

        if (minArea || maxArea) {
            whereClause.area_m2 = {};
            if (minArea) whereClause.area_m2[Op.gte] = minArea;
            if (maxArea) whereClause.area_m2[Op.lte] = maxArea;
        }

        // Geospatial Filter (PostGIS)
        if (lat && lng && radius) {
            const location = Sequelize.fn('ST_SetSRID', Sequelize.fn('ST_MakePoint', lng, lat), 4326);
            whereClause[Op.and] = Sequelize.where(
                Sequelize.fn('ST_DWithin', Sequelize.col('geom'), location, radius),
                true
            );
        }

        const lands = await Land.findAll({
            where: whereClause,
            include: [LandMedia],
            order: [['created_at', 'DESC']],
        });
        res.json(lands);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// Public endpoint - DO NOT include seller info (admin is intermediary)
export const getLandById = async (req: Request, res: Response) => {
    try {
        const land = await Land.findByPk(req.params.id, {
            include: [
                { model: LandMedia },
                // NO User/owner info for public view - admin is intermediary
            ],
        });
        if (!land) return res.status(404).json({ message: 'Land not found' });
        res.json(land);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// Admin only - includes full seller info
export const getLandByIdForAdmin = async (req: AuthRequest, res: Response) => {
    try {
        const land = await Land.findByPk(req.params.id, {
            include: [
                { model: LandMedia },
                { model: User, as: 'owner', attributes: ['id', 'full_name', 'email', 'phone'] },
                { model: LandDocument },
            ],
        });
        if (!land) return res.status(404).json({ message: 'Land not found' });
        res.json(land);
    } catch (error) {
        console.error('[getLandByIdForAdmin] Error:', error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

export const getMyLands = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        console.log(`[getMyLands] Fetching lands for user ID: ${userId}`);

        const lands = await Land.findAll({
            where: { owner_id: userId },
            include: [LandMedia],
            order: [['created_at', 'DESC']],
        });

        console.log(`[getMyLands] Found ${lands.length} lands for user ID: ${userId}`);
        res.json(lands);
    } catch (error) {
        console.error('[getMyLands] Error:', error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// User can update their own land and resubmit for approval
export const updateMyLand = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { title, description, price, area_m2, type, service_type, wilaya, baladia } = req.body;

        const land = await Land.findByPk(id);
        if (!land) {
            return res.status(404).json({ message: 'Land not found' });
        }

        // Check ownership
        if (land.owner_id !== userId) {
            return res.status(403).json({ message: 'Not authorized to edit this land' });
        }

        // Update fields
        if (title) land.title = title;
        if (description) land.description = description;
        if (price) land.price = parseFloat(price);
        if (area_m2) land.area_m2 = parseFloat(area_m2);
        if (type) land.type = type;
        if (service_type) land.service_type = service_type;
        if (wilaya) land.wilaya = wilaya;
        if (baladia) land.baladia = baladia;

        // Reset to pending for re-review
        land.status = LandStatus.PENDING;
        land.rejection_reason = undefined;

        await land.save();

        // Handle new file uploads
        const files = (req as any).files;

        // Handle Images
        if (files && files.images) {
            for (const [index, file] of files.images.entries()) {
                const optimizedFilename = await optimizeImage(
                    file.path,
                    file.filename,
                    file.destination
                );
                await LandMedia.create({
                    land_id: land.id,
                    url: `/uploads/images/${optimizedFilename}`,
                    media_type: MediaType.IMAGE,
                    order: index,
                });
            }
        }

        // Handle Videos
        if (files && files.videos) {
            for (const [index, file] of files.videos.entries()) {
                await LandMedia.create({
                    land_id: land.id,
                    url: `/uploads/videos/${file.filename}`,
                    media_type: MediaType.VIDEO,
                    order: index,
                });
            }
        }

        // Handle Documents
        if (files && files.documents) {
            for (const file of files.documents) {
                await LandDocument.create({
                    land_id: land.id,
                    url: `/uploads/documents/${file.filename}`,
                    doc_type: 'ownership_deed',
                    is_verified: false,
                });
            }
        }

        res.json({ message: 'Land updated and resubmitted for review', land });
    } catch (error) {
        console.error('[updateMyLand] Error:', error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};
