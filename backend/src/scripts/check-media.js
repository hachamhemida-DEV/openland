const { Sequelize } = require('sequelize-typescript');
const { Land } = require('../models/Land');
const { LandMedia } = require('../models/LandMedia');
const { User } = require('../models/User');
const { Document } = require('../models/Document');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    models: [Land, User, LandMedia, Document],
    logging: false,
});

async function checkMedia() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const lands = await Land.findAll({
            include: [LandMedia],
            order: [['created_at', 'DESC']],
            limit: 5
        });

        console.log(`Found ${lands.length} recent lands.`);

        lands.forEach(land => {
            console.log(`\nLand ID: ${land.id}, Title: ${land.title}`);
            console.log(`Media Count: ${land.media.length}`);
            land.media.forEach(m => {
                console.log(` - Type: ${m.media_type}, URL: ${m.url}`);
            });
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkMedia();
