"use strict";
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();
async function createAdmin() {
    const client = new Client({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
    try {
        await client.connect();
        console.log('✅ Connected to database');
        const adminEmail = 'admin@openland.com';
        const adminPassword = 'admin123';
        // Check if admin exists
        const checkQuery = 'SELECT * FROM users WHERE email = $1';
        const checkResult = await client.query(checkQuery, [adminEmail]);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);
        if (checkResult.rows.length === 0) {
            // Create new admin
            const insertQuery = `
                INSERT INTO users (email, password_hash, full_name, role, is_verified, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
                RETURNING id
            `;
            await client.query(insertQuery, [adminEmail, hashedPassword, 'Admin User', 'admin', true]);
            console.log('🎉 Admin account created!');
        }
        else {
            // Update existing user to admin
            const updateQuery = `
                UPDATE users 
                SET password_hash = $1, role = $2, full_name = $3
                WHERE email = $4
            `;
            await client.query(updateQuery, [hashedPassword, 'admin', 'Admin User', adminEmail]);
            console.log('🔄 Admin account updated!');
        }
        console.log('\n📧 Email: admin@openland.com');
        console.log('🔑 Password: admin123');
        console.log('\n⚠️  IMPORTANT: After logging out, login with these credentials');
    }
    catch (error) {
        console.error('❌ Error:', error.message);
    }
    finally {
        await client.end();
    }
}
createAdmin();
