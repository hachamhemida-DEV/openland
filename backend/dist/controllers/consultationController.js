"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respondToConsultation = exports.getAllConsultations = exports.getUserConsultations = exports.createConsultation = void 0;
const ConsultationRequest_1 = require("../models/ConsultationRequest");
const Notification_1 = require("../models/Notification");
// Create consultation request
const createConsultation = async (req, res) => {
    try {
        const { type, subject, description } = req.body;
        const userId = req.user.id;
        if (!type || !subject || !description) {
            return res.status(400).json({ message: 'Type, subject, and description are required' });
        }
        const consultation = await ConsultationRequest_1.ConsultationRequest.create({
            user_id: userId,
            type,
            subject,
            description,
            status: ConsultationRequest_1.ConsultationStatus.PENDING,
        });
        res.status(201).json({ message: 'Consultation request created', consultation });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.createConsultation = createConsultation;
// Get user's consultations
const getUserConsultations = async (req, res) => {
    try {
        const userId = req.user.id;
        const consultations = await ConsultationRequest_1.ConsultationRequest.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']],
        });
        res.json(consultations);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getUserConsultations = getUserConsultations;
// Admin: Get all consultations
const getAllConsultations = async (req, res) => {
    try {
        const consultations = await ConsultationRequest_1.ConsultationRequest.findAll({
            order: [['created_at', 'DESC']],
        });
        res.json(consultations);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getAllConsultations = getAllConsultations;
// Admin: Respond to consultation
const respondToConsultation = async (req, res) => {
    try {
        const { id } = req.params;
        const { response, status } = req.body;
        const consultation = await ConsultationRequest_1.ConsultationRequest.findByPk(id);
        if (!consultation) {
            return res.status(404).json({ message: 'Consultation not found' });
        }
        consultation.admin_response = response;
        consultation.status = status || ConsultationRequest_1.ConsultationStatus.COMPLETED;
        await consultation.save();
        // Create notification for user
        await Notification_1.Notification.create({
            user_id: consultation.user_id,
            type: Notification_1.NotificationType.CONSULTATION_RESPONSE,
            title: 'رد على استشارتك',
            message: `تم الرد على استشارتك: ${consultation.subject}`,
        });
        res.json({ message: 'Response sent', consultation });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.respondToConsultation = respondToConsultation;
