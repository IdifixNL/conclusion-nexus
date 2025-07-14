#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testAPI() {
  console.log('🧪 Testing Service Portal API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health check:', health.data);

    // Test role cards endpoint
    console.log('\n2. Testing role cards endpoint...');
    const cards = await axios.get(`${BASE_URL}/api/role-cards`);
    console.log('✅ Role cards:', cards.data.length, 'cards found');

    // Test user registration
    console.log('\n3. Testing user registration...');
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      password: 'testpassword123'
    };
    const register = await axios.post(`${BASE_URL}/api/register`, testUser);
    console.log('✅ User registered:', register.data.user.email);

    // Test user login
    console.log('\n4. Testing user login...');
    const login = await axios.post(`${BASE_URL}/api/login`, testUser);
    console.log('✅ User logged in, token received');

    // Test admin endpoints with token
    console.log('\n5. Testing admin endpoints...');
    const token = login.data.token;
    const adminUsers = await axios.get(`${BASE_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Admin users endpoint:', adminUsers.data.length, 'users found');

    console.log('\n🎉 All API tests passed successfully!');
    console.log('\n📋 Service Portal Status:');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Backend:  http://localhost:3001');
    console.log('   Database: localhost:5432');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testAPI(); 