"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("../models/User");
const Land_1 = require("../models/Land");
const LandMedia_1 = require("../models/LandMedia");
const Document_1 = require("../models/Document");
const Inquiry_1 = require("../models/Inquiry");
const Favorite_1 = require("../models/Favorite");
const Message_1 = require("../models/Message");
const ConsultationRequest_1 = require("../models/ConsultationRequest");
const Notification_1 = require("../models/Notification");
const UserPreference_1 = require("../models/UserPreference");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const resetAdmin = async () => {
    try {
        const sequelize = new sequelize_typescript_1.Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            dialect: 'postgres',
            logging: false,
        });
        // Register ALL models to avoid relationship errors
        sequelize.addModels([
            User_1.User,
            Land_1.Land,
            LandMedia_1.LandMedia,
            Document_1.Document,
            Inquiry_1.Inquiry,
            Favorite_1.Favorite,
            Message_1.Message,
            ConsultationRequest_1.ConsultationRequest,
            Notification_1.Notification,
            UserPreference_1.UserPreference,
        ]);
        await sequelize.authenticate();
        console.log('✅ Connected to database');
        const adminEmail = 'admin@openland.com';
        const newPassword = 'admin123';
        const admin = await User_1.User.findOne({ where: { email: adminEmail } });
        if (!admin) {
            console.log('🆕 Creating new admin account...');
            const salt = await bcryptjs_1.default.genSalt(10);
            const hashedPassword = await bcryptjs_1.default.hash(newPassword, salt);
            await User_1.User.create({
                full_name: 'Admin User',
                email: adminEmail,
                password_hash: hashedPassword,
                role: User_1.UserRole.ADMIN,
                is_verified: true,
            });
            console.log('✅ Admin account created!');
        }
        else {
            console.log('🔄 Updating existing admin password...');
            const salt = await bcryptjs_1.default.genSalt(10);
            const hashedPassword = await bcryptjs_1.default.hash(newPassword, salt);
            admin.password_hash = hashedPassword;
            admin.role = User_1.UserRole.ADMIN; // Ensure role is admin
            await admin.save();
            console.log('✅ Admin password updated!');
        }
        console.log('\n📧 Email: admin@openland.com');
        console.log('🔑 Password: admin123');
    }
    catch (error) {
        console.error('❌ Error:', error);
    }
    finally {
        process.exit();
    }
};
resetAdmin();
