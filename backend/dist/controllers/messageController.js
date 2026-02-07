"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversations = exports.getConversation = exports.sendMessage = void 0;
const Message_1 = require("../models/Message");
const User_1 = require("../models/User");
const Land_1 = require("../models/Land");
const sequelize_1 = require("sequelize");
// Send a message
const sendMessage = async (req, res) => {
    try {
        const { receiver_id, land_id, content } = req.body;
        const senderId = req.user.id;
        if (!content || !receiver_id) {
            return res.status(400).json({ message: 'Receiver and content are required' });
        }
        const message = await Message_1.Message.create({
            sender_id: senderId,
            receiver_id,
            land_id,
            content,
        });
        // Create notification for receiver
        try {
            const { Notification, NotificationType } = require('../models/Notification');
            const sender = await User_1.User.findByPk(senderId);
            await Notification.create({
                user_id: receiver_id,
                type: NotificationType.MESSAGE,
                title: 'رسالة جديدة',
                message: `لديك رسالة جديدة من ${sender?.full_name || 'مستخدم'}`,
                related_land_id: land_id,
            });
        }
        catch (notifError) {
            console.error('Failed to create notification:', notifError);
            // Don't fail the request if notification fails
        }
        res.status(201).json({ message: 'Message sent', data: message });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.sendMessage = sendMessage;
// Get conversation between two users
const getConversation = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;
        const messages = await Message_1.Message.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { sender_id: currentUserId, receiver_id: userId },
                    { sender_id: userId, receiver_id: currentUserId },
                ],
            },
            include: [
                { model: User_1.User, as: 'sender', attributes: ['id', 'full_name', 'email'] },
                { model: User_1.User, as: 'receiver', attributes: ['id', 'full_name', 'email'] },
                { model: Land_1.Land, attributes: ['id', 'title'] },
            ],
            order: [['created_at', 'ASC']],
        });
        // Mark messages as read
        await Message_1.Message.update({ is_read: true }, {
            where: {
                sender_id: userId,
                receiver_id: currentUserId,
                is_read: false,
            },
        });
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getConversation = getConversation;
// Get all conversations for a user
const getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        const messages = await Message_1.Message.findAll({
            where: {
                [sequelize_1.Op.or]: [{ sender_id: userId }, { receiver_id: userId }],
            },
            include: [
                { model: User_1.User, as: 'sender', attributes: ['id', 'full_name', 'email'] },
                { model: User_1.User, as: 'receiver', attributes: ['id', 'full_name', 'email'] },
            ],
            order: [['created_at', 'DESC']],
        });
        // Group by conversation partner
        const conversations = new Map();
        messages.forEach((msg) => {
            const partnerId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
            if (!conversations.has(partnerId)) {
                conversations.set(partnerId, {
                    partner: msg.sender_id === userId ? msg.receiver : msg.sender,
                    lastMessage: msg,
                    unreadCount: 0,
                });
            }
            if (msg.receiver_id === userId && !msg.is_read) {
                const conv = conversations.get(partnerId);
                conv.unreadCount++;
            }
        });
        res.json(Array.from(conversations.values()));
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getConversations = getConversations;
