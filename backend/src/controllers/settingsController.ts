import { Request, Response } from 'express';
import { SiteSettings } from '../models/SiteSettings';

// Get all settings (public - for frontend to display contact info)
export const getSettings = async (req: Request, res: Response) => {
    try {
        const settings = await SiteSettings.findAll();

        // Convert to object format
        const settingsObj: Record<string, string> = {};
        settings.forEach(s => {
            settingsObj[s.key] = s.value;
        });

        res.json(settingsObj);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// Update settings (admin only)
export const updateSettings = async (req: Request, res: Response) => {
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
                await SiteSettings.upsert({
                    key: setting.key,
                    value: setting.value,
                });
            }
        }

        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};
