"use strict";
const { Client } = require('pg');
require('dotenv').config();
async function checkAdmin() {
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
        // Get all users to see what exists
        const allUsersQuery = 'SELECT id, email, full_name, role, is_verified FROM users ORDER BY id';
        const allUsers = await client.query(allUsersQuery);
        console.log('📋 All users in database:');
        console.table(allUsers.rows);
        // Specifically check for admin
        const adminQuery = 'SELECT * FROM users WHERE email = $1';
        const adminResult = await client.query(adminQuery, ['admin@openland.com']);
        if (adminResult.rows.length === 0) {
            console.log('\n❌ Admin user does NOT exist!');
            console.log('Run: node src/scripts/create-admin.js');
        }
        else {
            console.log('\n✅ Admin user exists:');
            console.log('Email:', adminResult.rows[0].email);
            console.log('Role:', adminResult.rows[0].role);
            console.log('Verified:', adminResult.rows[0].is_verified);
        }
    }
    catch (error) {
        console.error('❌ Error:', error.message);
    }
    finally {
        await client.end();
    }
}
checkAdmin();
