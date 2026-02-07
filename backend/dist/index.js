"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./models/User");
const Land_1 = require("./models/Land");
const LandMedia_1 = require("./models/LandMedia");
const Document_1 = require("./models/Document");
const Inquiry_1 = require("./models/Inquiry");
const Favorite_1 = require("./models/Favorite");
const Message_1 = require("./models/Message");
const ConsultationRequest_1 = require("./models/ConsultationRequest");
const Notification_1 = require("./models/Notification");
const UserPreference_1 = require("./models/UserPreference");
const SiteSettings_1 = require("./models/SiteSettings");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const landRoutes_1 = __importDefault(require("./routes/landRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const favoriteRoutes_1 = __importDefault(require("./routes/favoriteRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const settingsRoutes_1 = __importDefault(require("./routes/settingsRoutes"));
const rateLimiter_1 = require("./middleware/rateLimiter");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Security Middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false, // Disable for development
    crossOriginEmbedderPolicy: false,
}));
// Note: xss-clean removed as it's deprecated
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Rate limiting on all API routes
app.use('/api/', rateLimiter_1.apiLimiter);
// Database Connection (PostgreSQL)
const sequelize = new sequelize_typescript_1.Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: false,
});
// Register Models
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
    SiteSettings_1.SiteSettings,
]);
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/lands', landRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/favorites', favoriteRoutes_1.default);
app.use('/api/messages', messageRoutes_1.default);
app.use('/api/notifications', notificationRoutes_1.default);
app.use('/api/settings', settingsRoutes_1.default);
// Serve uploaded files with CORS headers
app.use('/uploads', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express_1.default.static('uploads'));
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});
app.get('/', (req, res) => {
    res.json({ message: 'Openland API is running', timestamp: new Date() });
});
app.get('/health', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.json({ status: 'healthy', database: 'connected' });
    }
    catch (error) {
        res.status(500).json({ status: 'unhealthy', database: 'disconnected', error: error.message });
    }
});
// Start Server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established');
        // Sync database (alter: true updates tables without deleting data)
        await sequelize.sync({ alter: true });
        console.log('✅ Database synced - Tables updated without data loss!');
        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
    }
};
startServer();
