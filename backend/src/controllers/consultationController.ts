import { Response } from 'express';
import { ConsultationRequest, ConsultationType, ConsultationStatus } from '../models/ConsultationRequest';
import { Notification, NotificationType } from '../models/Notification';
import { AuthRequest } from '../middleware/authMiddleware';

// Create consultation request
export const createConsultation = async (req: AuthRequest, res: Response) => {
    try {
        const { type, subject, description } = req.body;
        const userId = req.user.id;

        if (!type || !subject || !description) {
            return res.status(400).json({ message: 'Type, subject, and description are required' });
        }

        const consultation = await ConsultationRequest.create({
            user_id: userId,
            type,
            subject,
            description,
            status: ConsultationStatus.PENDING,
        });

        res.status(201).json({ message: 'Consultation request created', consultation });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// Get user's consultations
export const getUserConsultations = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;

        const consultations = await ConsultationRequest.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']],
        });

        res.json(consultations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// Admin: Get all consultations
export const getAllConsultations = async (req: AuthRequest, res: Response) => {
    try {
        const consultations = await ConsultationRequest.findAll({
            order: [['created_at', 'DESC']],
        });

        res.json(consultations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// Admin: Respond to consultation
export const respondToConsultation = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { response, status } = req.body;

        const consultation = await ConsultationRequest.findByPk(id);
        if (!consultation) {
            return res.status(404).json({ message: 'Consultation not found' });
        }

        consultation.admin_response = response;
        consultation.status = status || ConsultationStatus.COMPLETED;
        await consultation.save();

        // Create notification for user
        await Notification.create({
            user_id: consultation.user_id,
            type: NotificationType.CONSULTATION_RESPONSE,
            title: 'رد على استشارتك',
            message: `تم الرد على استشارتك: ${consultation.subject}`,
        });

        res.json({ message: 'Response sent', consultation });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};
