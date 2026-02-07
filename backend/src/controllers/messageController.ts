import { Response } from 'express';
import { Message } from '../models/Message';
import { User } from '../models/User';
import { Land } from '../models/Land';
import { AuthRequest } from '../middleware/authMiddleware';
import { Op } from 'sequelize';

// Send a message
export const sendMessage = async (req: AuthRequest, res: Response) => {
    try {
        const { receiver_id, land_id, content } = req.body;
        const senderId = req.user.id;

        if (!content || !receiver_id) {
            return res.status(400).json({ message: 'Receiver and content are required' });
        }

        const message = await Message.create({
            sender_id: senderId,
            receiver_id,
            land_id,
            content,
        });

        // Create notification for receiver
        try {
            const { Notification, NotificationType } = require('../models/Notification');
            const sender = await User.findByPk(senderId);

            await Notification.create({
                user_id: receiver_id,
                type: NotificationType.MESSAGE,
                title: 'رسالة جديدة',
                message: `لديك رسالة جديدة من ${sender?.full_name || 'مستخدم'}`,
                related_land_id: land_id,
            });
        } catch (notifError) {
            console.error('Failed to create notification:', notifError);
            // Don't fail the request if notification fails
        }

        res.status(201).json({ message: 'Message sent', data: message });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// Get conversation between two users
export const getConversation = async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { sender_id: currentUserId, receiver_id: userId },
                    { sender_id: userId, receiver_id: currentUserId },
                ],
            },
            include: [
                { model: User, as: 'sender', attributes: ['id', 'full_name', 'email'] },
                { model: User, as: 'receiver', attributes: ['id', 'full_name', 'email'] },
                { model: Land, attributes: ['id', 'title'] },
            ],
            order: [['created_at', 'ASC']],
        });

        // Mark messages as read
        await Message.update(
            { is_read: true },
            {
                where: {
                    sender_id: userId,
                    receiver_id: currentUserId,
                    is_read: false,
                },
            }
        );

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// Get all conversations for a user
export const getConversations = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;

        const messages = await Message.findAll({
            where: {
                [Op.or]: [{ sender_id: userId }, { receiver_id: userId }],
            },
            include: [
                { model: User, as: 'sender', attributes: ['id', 'full_name', 'email'] },
                { model: User, as: 'receiver', attributes: ['id', 'full_name', 'email'] },
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
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};
