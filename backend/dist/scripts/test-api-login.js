"use strict";
const fetch = require('node-fetch');
async function testLogin() {
    try {
        console.log('🔐 Testing admin login...\n');
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@openland.com',
                password: 'admin123'
            })
        });
        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));
        if (response.ok) {
            console.log('\n✅ Login successful!');
            console.log('User role:', data.user.role);
        }
        else {
            console.log('\n❌ Login failed!');
            console.log('Message:', data.message);
        }
    }
    catch (error) {
        console.error('❌ Error:', error.message);
    }
}
testLogin();
