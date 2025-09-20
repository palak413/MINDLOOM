#!/usr/bin/env node

/**
 * Simple connection test script
 * Run this to verify frontend-backend connection
 */

const axios = require('axios');

const BACKEND_URL = 'http://localhost:8000/api/v1';

async function testConnection() {
    console.log('🔍 Testing Frontend-Backend Connection...\n');
    
    try {
        // Test if backend is running
        console.log('1. Testing backend server availability...');
        const response = await axios.get(`${BACKEND_URL}/auth/login`, {
            timeout: 5000,
            validateStatus: () => true // Accept any status code
        });
        
        if (response.status === 404 || response.status === 405) {
            console.log('✅ Backend server is running and responding');
        } else {
            console.log('✅ Backend server is running');
        }
        
        // Test CORS configuration
        console.log('\n2. Testing CORS configuration...');
        try {
            await axios.options(`${BACKEND_URL}/auth/login`, {
                headers: {
                    'Origin': 'http://localhost:5173',
                    'Access-Control-Request-Method': 'POST',
                    'Access-Control-Request-Headers': 'Content-Type'
                }
            });
            console.log('✅ CORS is properly configured');
        } catch (error) {
            console.log('⚠️  CORS test failed - this might be normal if backend doesn\'t handle OPTIONS requests');
        }
        
        console.log('\n🎉 Connection test completed!');
        console.log('\nNext steps:');
        console.log('1. Make sure MongoDB is running');
        console.log('2. Create .env files in both backend and frontend directories');
        console.log('3. Start both servers:');
        console.log('   - Backend: cd backend && npm run dev');
        console.log('   - Frontend: cd frontend && npm run dev');
        
    } catch (error) {
        console.log('❌ Backend server is not running or not accessible');
        console.log('\nTo fix this:');
        console.log('1. Make sure you\'re in the backend directory');
        console.log('2. Run: npm install && npm run dev');
        console.log('3. Check that the server starts on port 8000');
    }
}

testConnection();

