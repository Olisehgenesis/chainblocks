#!/usr/bin/env node

// Test script to debug solc worker issues
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Testing Solc Worker...');

// Test the worker file exists and is readable
const workerPath = path.join(__dirname, 'public', 'solc-worker.js');
console.log('Worker path:', workerPath);

if (fs.existsSync(workerPath)) {
    console.log('✅ Worker file exists');
    const content = fs.readFileSync(workerPath, 'utf8');
    console.log('Worker file size:', content.length, 'bytes');
    
    // Check for key functions
    if (content.includes('ensureSolcLoaded')) {
        console.log('✅ ensureSolcLoaded function found');
    } else {
        console.log('❌ ensureSolcLoaded function not found');
    }
    
    if (content.includes('self.Module.cwrap')) {
        console.log('✅ self.Module.cwrap usage found');
    } else {
        console.log('❌ self.Module.cwrap usage not found');
    }
    
    if (content.includes('SOLC_URL')) {
        console.log('✅ SOLC_URL defined');
        const solcUrlMatch = content.match(/const SOLC_URL = '([^']+)'/);
        if (solcUrlMatch) {
            console.log('SOLC URL:', solcUrlMatch[1]);
        }
    } else {
        console.log('❌ SOLC_URL not found');
    }
    
} else {
    console.log('❌ Worker file does not exist');
}

// Test if we can access the SOLC URL
const solcUrl = 'https://binaries.soliditylang.org/bin/soljson-v0.8.20+commit.a1b79de6.js';
console.log('\nTesting SOLC URL accessibility...');

import { URL } from 'url';
const parsedUrl = new URL(solcUrl);
const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || 443,
    path: parsedUrl.path,
    method: 'HEAD',
    timeout: 5000
};

const req = https.request(options, (res) => {
    console.log('✅ SOLC URL is accessible');
    console.log('Status:', res.statusCode);
    console.log('Content-Type:', res.headers['content-type']);
    console.log('Content-Length:', res.headers['content-length']);
});

req.on('error', (err) => {
    console.log('❌ SOLC URL error:', err.message);
});

req.on('timeout', () => {
    console.log('❌ SOLC URL timeout');
    req.destroy();
});

req.end();
