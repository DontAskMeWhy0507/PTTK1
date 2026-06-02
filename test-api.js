const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function test() {
  try {
    console.log('--- Testing Login ---');
    const adminLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@pttk.vn',
      password: '123456'
    });
    const adminToken = adminLogin.data.token;
    console.log('Admin login success');

    const customerLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'khach1@gmail.com',
      password: '123456'
    });
    const customerToken = customerLogin.data.token;
    console.log('Customer login success');

    const memberLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'khach2@gmail.com',
      password: '123456'
    });
    const memberToken = memberLogin.data.token;
    console.log('Member login success');

    console.log('\n--- Testing Property Access (Guest) ---');
    const guestProperties = await axios.get(`${BASE_URL}/properties`);
    console.log('Guest see property 0 address:', guestProperties.data[0].dia_chi_chi_tiet);

    console.log('\n--- Testing Property Access (Customer - Guest/Non-member) ---');
    const customerProperties = await axios.get(`${BASE_URL}/properties`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    console.log('Customer see property 0 address:', customerProperties.data[0].dia_chi_chi_tiet);

    console.log('\n--- Testing Property Access (Member) ---');
    const memberProperties = await axios.get(`${BASE_URL}/properties`, {
      headers: { Authorization: `Bearer ${memberToken}` }
    });
    console.log('Member see property 0 address:', memberProperties.data[0].dia_chi_chi_tiet);

    console.log('\n--- Testing Property Access (Admin) ---');
    const adminProperties = await axios.get(`${BASE_URL}/properties`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('Admin see property 0 address:', adminProperties.data[0].dia_chi_chi_tiet);

  } catch (error) {
    console.error('Test failed:', error.response ? error.response.data : error.message);
  }
}

test();
