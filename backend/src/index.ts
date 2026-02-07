import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import { User } from './models/User';
import { Land } from './models/Land';
import { LandMedia } from './models/LandMedia';
import { Document } from './models/Document';
import { Inquiry } from './models/Inquiry';
import { Favorite } from './models/Favorite';
import { Message } from './models/Message';
import { ConsultationRequest } from './models/ConsultationRequest';
import { Notification } from './models/Notification';
import { UserPreference } from './models/UserPreference';
import { SiteSettings } from './models/SiteSettings';
import authRoutes from './routes/authRoutes';
import landRoutes from './routes/landRoutes';
import adminRoutes from './routes/adminRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import messageRoutes from './routes/messageRoutes';
import notificationRoutes from './routes/notificationRoutes';
import settingsRoutes from './routes/settingsRoutes';
import { apiLimiter } from './middleware/rateLimiter';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable for development
    crossOriginEmbedderPolicy: false,
}));
// Note: xss-clean removed as it's deprecated
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting on all API routes
app.use('/api/', apiLimiter);

// Database Connection (PostgreSQL)
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

// Register Models
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
    SiteSettings,
]);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lands', landRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);

// Serve uploaded files with CORS headers
app.use('/uploads', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express.static('uploads'));

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
    } catch (error) {
        res.status(500).json({ status: 'unhealthy', database: 'disconnected', error: (error as Error).message });
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
    } catch (error) {
        console.error('❌ Failed to start server:', error);
    }
};

startServer();
