"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLand = exports.deleteLand = exports.getAllLands = exports.getDashboardStats = exports.verifyDocument = exports.verifyLand = exports.getPendingLands = void 0;
const Land_1 = require("../models/Land");
const Document_1 = require("../models/Document");
const User_1 = require("../models/User");
const getPendingLands = async (req, res) => {
    try {
        const lands = await Land_1.Land.findAll({
            where: { status: Land_1.LandStatus.PENDING },
            include: [
                { model: User_1.User, as: 'owner' },
                Document_1.Document
            ],
            order: [['created_at', 'ASC']],
        });
        res.json(lands);
    }
    catch (error) {
        console.error('[getPendingLands] Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getPendingLands = getPendingLands;
const verifyLand = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejection_reason } = req.body; // 'verified' or 'rejected' + optional reason
        if (![Land_1.LandStatus.VERIFIED, Land_1.LandStatus.REJECTED].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const land = await Land_1.Land.findByPk(id);
        if (!land)
            return res.status(404).json({ message: 'Land not found' });
        land.status = status;
        // Store rejection reason if rejected
        if (status === Land_1.LandStatus.REJECTED && rejection_reason) {
            land.rejection_reason = rejection_reason;
        }
        else if (status === Land_1.LandStatus.VERIFIED) {
            land.rejection_reason = undefined; // Clear if now verified
        }
        await land.save();
        // Notify land owner
        try {
            const { Notification, NotificationType } = require('../models/Notification');
            const title = status === Land_1.LandStatus.VERIFIED ? 'تمت الموافقة على عقارك' : 'تم رفض عقارك';
            let message = status === Land_1.LandStatus.VERIFIED
                ? `تمت الموافقة على عقارك "${land.title}" وأصبح معروضاً للجميع`
                : `تم رفض عقارك "${land.title}".`;
            // Add rejection reason to notification message
            if (status === Land_1.LandStatus.REJECTED && rejection_reason) {
                message += ` السبب: ${rejection_reason}`;
            }
            const type = status === Land_1.LandStatus.VERIFIED ? NotificationType.LAND_VERIFIED : NotificationType.LAND_REJECTED;
            await Notification.create({
                user_id: land.owner_id,
                type,
                title,
                message,
                related_land_id: land.id,
            });
        }
        catch (notifError) {
            console.error('Failed to create notification:', notifError);
        }
        res.json({ message: `Land ${status} successfully`, land });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.verifyLand = verifyLand;
const verifyDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_verified } = req.body;
        const document = await Document_1.Document.findByPk(id);
        if (!document)
            return res.status(404).json({ message: 'Document not found' });
        document.is_verified = is_verified;
        document.verified_at = new Date();
        await document.save();
        res.json({ message: 'Document updated', document });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.verifyDocument = verifyDocument;
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User_1.User.count();
        const totalLands = await Land_1.Land.count();
        const pendingLands = await Land_1.Land.count({ where: { status: Land_1.LandStatus.PENDING } });
        const verifiedLands = await Land_1.Land.count({ where: { status: Land_1.LandStatus.VERIFIED } });
        res.json({
            totalUsers,
            totalLands,
            pendingLands,
            verifiedLands,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getDashboardStats = getDashboardStats;
const getAllLands = async (req, res) => {
    try {
        const { search } = req.query;
        let whereClause = {};
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
        const lands = await Land_1.Land.findAll({
            where: whereClause,
            include: [{ model: User_1.User, as: 'owner' }],
            order: [['created_at', 'DESC']],
        });
        res.json(lands);
    }
    catch (error) {
        console.error('[getAllLands] Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getAllLands = getAllLands;
const deleteLand = async (req, res) => {
    try {
        const { id } = req.params;
        const land = await Land_1.Land.findByPk(id);
        if (!land)
            return res.status(404).json({ message: 'Land not found' });
        await land.destroy();
        res.json({ message: 'Land deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.deleteLand = deleteLand;
// Admin can edit any land
const updateLand = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, area_m2, type, service_type, wilaya, baladia } = req.body;
        const land = await Land_1.Land.findByPk(id);
        if (!land)
            return res.status(404).json({ message: 'Land not found' });
        // Update only provided fields
        if (title)
            land.title = title;
        if (description)
            land.description = description;
        if (price)
            land.price = parseFloat(price);
        if (area_m2)
            land.area_m2 = parseFloat(area_m2);
        if (type)
            land.type = type;
        if (service_type)
            land.service_type = service_type;
        if (wilaya)
            land.wilaya = wilaya;
        if (baladia)
            land.baladia = baladia;
        await land.save();
        res.json({ message: 'Land updated successfully', land });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.updateLand = updateLand;
