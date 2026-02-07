import { Sequelize } from 'sequelize-typescript';
import { User, UserRole } from '../models/User';
import { Land } from '../models/Land';
import { LandMedia } from '../models/LandMedia';
import { Document } from '../models/Document';
import { Inquiry } from '../models/Inquiry';
import { Favorite } from '../models/Favorite';
import { Message } from '../models/Message';
import { ConsultationRequest } from '../models/ConsultationRequest';
import { Notification } from '../models/Notification';
import { UserPreference } from '../models/UserPreference';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const resetAdmin = async () => {
    try {
        const sequelize = new Sequelize(
            process.env.DB_NAME as string,
            process.env.DB_USER as string,
            process.env.DB_PASSWORD as string,
            {
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT || '5432'),
                dialect: 'postgres',
                logging: false,
            }
        );

        // Register ALL models to avoid relationship errors
        sequelize.addModels([
            User,
            Land,
            LandMedia,
            Document,
            Inquiry,
            Favorite,
            Message,
            ConsultationRequest,
            Notification,
            UserPreference,
        ]);

        await sequelize.authenticate();
        console.log('✅ Connected to database');

        const adminEmail = 'admin@openland.com';
        const newPassword = 'admin123';

        const admin = await User.findOne({ where: { email: adminEmail } });

        if (!admin) {
            console.log('🆕 Creating new admin account...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            await User.create({
                full_name: 'Admin User',
                email: adminEmail,
                password_hash: hashedPassword,
                role: UserRole.ADMIN,
                is_verified: true,
            });
            console.log('✅ Admin account created!');
        } else {
            console.log('🔄 Updating existing admin password...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            admin.password_hash = hashedPassword;
            admin.role = UserRole.ADMIN; // Ensure role is admin
            await admin.save();
            console.log('✅ Admin password updated!');
        }

        console.log('\n📧 Email: admin@openland.com');
        console.log('🔑 Password: admin123');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        process.exit();
    }
};

resetAdmin();
