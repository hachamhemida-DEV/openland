"use strict";
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();
async function forceResetAdmin() {
    const client = new Client({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
    try {
        await client.connect();
        console.log('✅ Connected to database\n');
        const adminEmail = 'admin@openland.com';
        const plainPassword = 'admin123';
        console.log(`🔒 Creating fresh password hash...`);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        console.log('🗑️  Deleting old admin if exists...');
        await client.query('DELETE FROM users WHERE email = $1', [adminEmail]);
        console.log('🆕 Creating new admin account...');
        const insertQuery = `
            INSERT INTO users (email, password_hash, full_name, role, is_verified, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
            RETURNING id, email, role
        `;
        const result = await client.query(insertQuery, [
            adminEmail,
            hashedPassword,
            'Admin User',
            'admin',
            true
        ]);
        console.log('\n✅ Admin account created successfully!');
        console.log('ID:', result.rows[0].id);
        console.log('Email:', result.rows[0].email);
        console.log('Role:', result.rows[0].role);
        console.log('\n📧 Email: admin@openland.com');
        console.log('🔑 Password: admin123');
        console.log('\n✨ You can now login!');
    }
    catch (error) {
        console.error('❌ Error:', error.message);
    }
    finally {
        await client.end();
    }
}
forceResetAdmin();
