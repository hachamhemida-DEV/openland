"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.getSettings = void 0;
const SiteSettings_1 = require("../models/SiteSettings");
// Get all settings (public - for frontend to display contact info)
const getSettings = async (req, res) => {
    try {
        const settings = await SiteSettings_1.SiteSettings.findAll();
        // Convert to object format
        const settingsObj = {};
        settings.forEach(s => {
            settingsObj[s.key] = s.value;
        });
        res.json(settingsObj);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getSettings = getSettings;
// Update settings (admin only)
const updateSettings = async (req, res) => {
    try {
        const { office_phone, office_whatsapp, office_email, office_address } = req.body;
        const settingsToUpdate = [
            { key: 'office_phone', value: office_phone },
            { key: 'office_whatsapp', value: office_whatsapp },
            { key: 'office_email', value: office_email },
            { key: 'office_address', value: office_address },
        ];
        for (const setting of settingsToUpdate) {
            if (setting.value !== undefined) {
                await SiteSettings_1.SiteSettings.upsert({
                    key: setting.key,
                    value: setting.value,
                });
            }
        }
        res.json({ message: 'Settings updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.updateSettings = updateSettings;
