
const API_URL = 'http://localhost:3000';
const EMAIL = 'benchmark@example.com';
const PASSWORD = 'password123';

async function benchmark() {
  console.log('Starting benchmark...');

  // 1. Register (ignore error)
  try {
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD, name: 'Bench' }),
    });
    // Consume body to avoid hanging
    await regRes.text();
  } catch (e) {
    // Ignore
  }

  // 2. Login
  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });

  if (!loginRes.ok) {
    const text = await loginRes.text();
    console.error('Login failed:', text);
    throw new Error('Login failed: ' + text);
  }

  const data: any = await loginRes.json();
  const access_token = data.access_token;

  if (!access_token) {
     console.error('No token returned');
     throw new Error('No token returned');
  }

  console.log('Logged in. Token acquired.');

  // 3. Warmup
  const warmRes = await fetch(`${API_URL}/dashboard/stats`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  await warmRes.text();

  // 4. Benchmark
  const ITERATIONS = 50;
  const times: number[] = [];

  console.log(`Running ${ITERATIONS} requests...`);
  const startTotal = performance.now();

  for (let i = 0; i < ITERATIONS; i++) {
    const start = performance.now();
    const res = await fetch(`${API_URL}/dashboard/stats`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const end = performance.now();
    await res.text(); // Ensure body is read

    if (!res.ok) {
        console.error(`Request ${i} failed:`, res.status);
    }
    times.push(end - start);
  }
  const endTotal = performance.now();

  const totalTime = endTotal - startTotal;
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);

  console.log('--- Results ---');
  console.log(`Total Time: ${totalTime.toFixed(2)}ms`);
  console.log(`Avg Latency: ${avg.toFixed(2)}ms`);
  console.log(`Min Latency: ${min.toFixed(2)}ms`);
  console.log(`Max Latency: ${max.toFixed(2)}ms`);
}

benchmark().catch((e) => {
    console.error(e);
    // process.exit(1); // Avoid process.exit to prevent TS error if type missing
});
