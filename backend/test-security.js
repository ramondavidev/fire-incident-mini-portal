#!/usr/bin/env node

const http = require('http');

// Test function to make HTTP requests
function testEndpoint(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body,
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(data);
    }

    req.end();
  });
}

async function runSecurityTests() {
  console.log('🔒 Running Security Tests...\n');

  // Test 1: Security Headers
  console.log('1. Testing Security Headers...');
  try {
    const response = await testEndpoint({
      hostname: 'localhost',
      port: 3001,
      path: '/health',
      method: 'GET',
    });

    console.log(`   Status: ${response.statusCode}`);
    console.log('   Security Headers:');
    console.log(
      `   - X-Content-Type-Options: ${response.headers['x-content-type-options'] || 'MISSING'}`
    );
    console.log(
      `   - X-Frame-Options: ${response.headers['x-frame-options'] || 'MISSING'}`
    );
    console.log(
      `   - Strict-Transport-Security: ${response.headers['strict-transport-security'] || 'MISSING'}`
    );
    console.log(
      `   - Content-Security-Policy: ${response.headers['content-security-policy'] ? 'SET' : 'MISSING'}`
    );
    console.log(
      `   - X-Powered-By: ${response.headers['x-powered-by'] || 'HIDDEN ✓'}`
    );
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  console.log('');

  // Test 2: CORS
  console.log('2. Testing CORS Protection...');
  try {
    const response = await testEndpoint({
      hostname: 'localhost',
      port: 3001,
      path: '/health',
      method: 'GET',
      headers: {
        Origin: 'http://localhost:3000',
      },
    });

    console.log(`   Status: ${response.statusCode}`);
    console.log(
      `   Access-Control-Allow-Origin: ${response.headers['access-control-allow-origin'] || 'NOT SET'}`
    );
    console.log(
      `   Access-Control-Allow-Credentials: ${response.headers['access-control-allow-credentials'] || 'NOT SET'}`
    );
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  console.log('');

  // Test 3: Request Size Limit
  console.log('3. Testing Request Size Limits...');
  try {
    const largePayload = JSON.stringify({ data: 'x'.repeat(2 * 1024 * 1024) }); // 2MB payload
    const response = await testEndpoint(
      {
        hostname: 'localhost',
        port: 3001,
        path: '/api/incidents',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(largePayload),
        },
      },
      largePayload
    );

    console.log(
      `   Status: ${response.statusCode} (should be 413 for payload too large)`
    );
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  console.log('');

  // Test 4: Rate Limiting (simulate multiple requests)
  console.log('4. Testing Rate Limiting...');
  try {
    const requests = [];
    for (let i = 0; i < 5; i++) {
      requests.push(
        testEndpoint({
          hostname: 'localhost',
          port: 3001,
          path: '/health',
          method: 'GET',
        })
      );
    }

    const responses = await Promise.all(requests);
    const statusCodes = responses.map((r) => r.statusCode);
    console.log(`   Request Status Codes: ${statusCodes.join(', ')}`);
    console.log(
      `   All successful: ${statusCodes.every((code) => code === 200) ? '✓' : '❌'}`
    );
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  console.log('');

  console.log('🎉 Security tests completed!');
}

// Run the tests
runSecurityTests().catch(console.error);
