const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testUpload() {
    try {
        // 1. Login to get token
        console.log('Logging in...');
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'seller@example.com', // Needs a valid user. I'll create one if needed or assume one exists.
                password: 'password123'
            })
        });

        const loginData = await loginRes.json();
        if (!loginData.token) {
            console.error('Login failed:', loginData);
            // Try registering if login fails
            console.log('Login failed, trying to register new user...');
            const regRes = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: 'Test File Seller',
                    email: `seller_${Date.now()}@example.com`,
                    password: 'password123',
                    role: 'seller',
                    phone: '0550123456'
                })
            });
            const regData = await regRes.json();
            if (!regData.token) {
                throw new Error('Registration failed: ' + JSON.stringify(regData));
            }
            console.log('Registered new user.');
            runUpload(regData.token);
        } else {
            console.log('Logged in successfully.');
            runUpload(loginData.token);
        }

    } catch (e) {
        console.error('Setup error:', e);
    }
}

async function runUpload(token) {
    console.log('Starting upload test...');
    const form = new FormData();

    // Create a dummy image file
    const dummyPath = path.join(__dirname, 'dummy.jpg');
    if (!fs.existsSync(dummyPath)) {
        fs.writeFileSync(dummyPath, 'fake image content'); // This might fail image validation if strict, but let's try.
        // Actually, sharper/multer might reject text as image. 
        // Better to not rely on fake content if possible, but I don't have a real image handy easily.
        // I will try to use a valid header signature if I can, or just expect a validation error.
        // A hang would happen BEFORE validation if it's a Multer stream issue.
        // Validation error is GOOD (means no hang). Hang is BAD.
    }

    form.append('title', 'Test Land ' + Date.now());
    form.append('description', 'This is a test land description for debugging purposes.');
    form.append('price', '1000000');
    form.append('area_m2', '500');
    form.append('type', 'private');
    form.append('service_type', 'sale');
    form.append('wilaya', 'Algiers');
    form.append('baladia', 'Hydra');
    form.append('phone', '0550123456');
    // form.append('images', fs.createReadStream(dummyPath)); 

    // Sending request
    try {
        console.log('Sending POST request to /api/lands...');
        const res = await fetch('http://localhost:5000/api/lands', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                ...form.getHeaders()
            },
            body: form
        });

        console.log('Response status:', res.status);
        const data = await res.json();
        console.log('Response body:', data);
    } catch (err) {
        console.error('Request failed/timed out:', err);
    }
}

testUpload();
