const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const HOST = 'localhost';
const PORT = 5000;

function request(method, path, headers, body) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: HOST,
            port: PORT,
            path: path,
            method: method,
            headers: headers
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: data
                });
            });
        });

        req.on('error', (e) => reject(e));

        if (body) {
            req.write(body);
        }
        req.end();
    });
}

async function run() {
    try {
        console.log('1. Registering/Logging in...');
        const loginPayload = JSON.stringify({
            full_name: "Native Test",
            email: "native_test_" + Date.now() + "@example.com",
            password: "password123",
            role: "seller",
            phone: "0550998877"
        });

        const authRes = await request('POST', '/api/auth/register', {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(loginPayload)
        }, loginPayload);

        console.log('Auth Status:', authRes.statusCode);
        const authData = JSON.parse(authRes.body);

        if (!authData.token) {
            console.error('Auth failed:', authData);
            process.exit(1);
        }

        const token = authData.token;
        console.log('Got token.');

        // 2. Prepare Multipart Upload
        const boundary = '----WebKitFormBoundary' + Date.now();
        const crlf = '\r\n';

        // Dummy image - Use REAL image
        const imgPath = 'c:/xampp/htdocs/openland/frontend/public/logo.jpg';
        if (!fs.existsSync(imgPath)) {
            console.error('Real image not found at:', imgPath);
            process.exit(1);
        }
        const imgContent = fs.readFileSync(imgPath);

        const parts = [
            `--${boundary}`,
            `Content-Disposition: form-data; name="title"`,
            '',
            'Native Test Land (Real Image)',
            `--${boundary}`,
            `Content-Disposition: form-data; name="description"`,
            '',
            'Description for native test land',
            `--${boundary}`,
            `Content-Disposition: form-data; name="price"`,
            '',
            '5000000',
            `--${boundary}`,
            `Content-Disposition: form-data; name="area_m2"`,
            '',
            '1000',
            `--${boundary}`,
            `Content-Disposition: form-data; name="type"`,
            '',
            'private',
            `--${boundary}`,
            `Content-Disposition: form-data; name="service_type"`,
            '',
            'sale',
            `--${boundary}`,
            `Content-Disposition: form-data; name="wilaya"`,
            '',
            'Oran',
            `--${boundary}`,
            `Content-Disposition: form-data; name="baladia"`,
            '',
            'Es Senia',
            `--${boundary}`,
            `Content-Disposition: form-data; name="phone"`,
            '',
            '0550123456',
            `--${boundary}`,
            `Content-Disposition: form-data; name="images"; filename="dummy.jpg"`,
            'Content-Type: image/jpeg',
            '',
            imgContent, // Include raw buffer? No, string concatenation will corrupt it. Need Buffer.concat
            `--${boundary}--`,
            '' // trailing newline
        ];

        // Construct Buffer body
        const bodyParts = [];
        for (const part of parts) {
            if (Buffer.isBuffer(part)) {
                bodyParts.push(part);
                bodyParts.push(Buffer.from(crlf));
            } else {
                bodyParts.push(Buffer.from(part + crlf));
            }
        }

        // Fix: logic above is slightly flawed for mixing strings/buffers.
        // Correct way:
        const payloadParts = [];

        // Fields
        const fields = [
            ['title', 'Native Test Land'],
            ['description', 'Description for native test land'],
            ['price', '5000000'],
            ['area_m2', '1000'],
            ['type', 'private'],
            ['service_type', 'sale'],
            ['wilaya', 'Oran'],
            ['baladia', 'Es Senia'],
            ['phone', '0550123456']
        ];

        for (const [name, value] of fields) {
            payloadParts.push(Buffer.from(`--${boundary}${crlf}Content-Disposition: form-data; name="${name}"${crlf}${crlf}${value}${crlf}`));
        }

        // File
        payloadParts.push(Buffer.from(`--${boundary}${crlf}Content-Disposition: form-data; name="images"; filename="dummy.jpg"${crlf}Content-Type: image/jpeg${crlf}${crlf}`));
        payloadParts.push(imgContent);
        payloadParts.push(Buffer.from(`${crlf}--${boundary}--${crlf}`));

        const bodyBuffer = Buffer.concat(payloadParts);

        console.log('Sending Upload Request...');
        const uploadRes = await request('POST', '/api/lands', {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': bodyBuffer.length,
            'Authorization': `Bearer ${token}`
        }, bodyBuffer);

        console.log('Upload Status:', uploadRes.statusCode);
        console.log('Upload Body:', uploadRes.body);

    } catch (e) {
        console.error('Error:', e);
    }
}

run();
