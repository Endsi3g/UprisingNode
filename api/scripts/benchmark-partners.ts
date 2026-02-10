import axios from 'axios';

async function main() {
  console.log('Starting benchmark...');
  try {
    const loginRes = await axios.post('http://localhost:3000/auth/login', {
       email: 'partner0@example.com',
       password: 'password123'
    });

    const token = loginRes.data.access_token;
    if (!token) throw new Error('No token returned');

    console.log('Logged in. Fetching partners...');

    const reqStart = Date.now();
    const res = await axios.get('http://localhost:3000/users/partners', {
        headers: { Authorization: `Bearer ${token}` }
    });
    const duration = Date.now() - reqStart;

    console.log(`Request took ${duration}ms`);
    if (res.data.meta) {
        console.log(`Partners count (page): ${res.data.data.length}`);
        console.log(`Total partners: ${res.data.meta.total}`);
    } else {
        console.log(`Partners count: ${Array.isArray(res.data) ? res.data.length : 'Not an array'}`);
    }

  } catch (e: any) {
    console.error('Benchmark failed', e.message);
    if (e.response) {
        console.error('Status:', e.response.status);
        console.error('Data:', e.response.data);
    }
  }
}

main();
