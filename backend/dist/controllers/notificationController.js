"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllAsRead = exports.markAsRead = exports.getNotifications = void 0;
const Notification_1 = require("../models/Notification");
// Get user notifications
const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const { count, rows } = await Notification_1.Notification.findAndCountAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']],
            limit,
            offset,
        });
        // Count unread
        const unreadCount = await Notification_1.Notification.count({
            where: {
                user_id: userId,
                is_read: false
            }
        });
        res.json({
            notifications: rows,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            unreadCount
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getNotifications = getNotifications;
// Mark notification as read
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const notification = await Notification_1.Notification.findOne({
            where: { id, user_id: userId }
        });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        notification.is_read = true;
        await notification.save();
        res.json({ message: 'Marked as read', notification });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.markAsRead = markAsRead;
// Mark all as read
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        await Notification_1.Notification.update({ is_read: true }, { where: { user_id: userId, is_read: false } });
        res.json({ message: 'All notifications marked as read' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.markAllAsRead = markAllAsRead;
