import { ScraperService } from '../src/scraper/scraper.service';
import http from 'http';
import { AddressInfo } from 'net';

async function runBenchmark() {
  // 1. Setup local server
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <head>
          <title>Benchmark Test</title>
          <meta name="description" content="This is a benchmark test page">
        </head>
        <body>
          <h1>Heading 1</h1>
          <h2>Heading 2</h2>
        </body>
      </html>
    `);
  });

  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve());
  });

  const port = (server.address() as AddressInfo).port;
  const url = `http://127.0.0.1:${port}`;
  console.log(`Test server running at ${url}`);

  // 2. Initialize Service
  const scraperService = new ScraperService();
  // If the service implements OnModuleInit, we might need to call it manually in the future version,
  // but for the baseline (current code), it doesn't have it.
  // We will check if 'onModuleInit' exists and call it to be forward-compatible with the optimized version.
  if (typeof (scraperService as any).onModuleInit === 'function') {
    console.log('Initializing module...');
    await (scraperService as any).onModuleInit();
  }

  const iterations = 10;
  console.log(`Starting benchmark with ${iterations} iterations...`);

  const startTotal = performance.now();

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    try {
      await scraperService.scrapeCompany(url);
      const end = performance.now();
      console.log(`Iteration ${i + 1}: ${(end - start).toFixed(2)}ms`);
    } catch (e) {
      console.error(`Iteration ${i + 1} failed:`, e);
    }
  }

  const endTotal = performance.now();
  const totalTime = endTotal - startTotal;
  const avgTime = totalTime / iterations;

  console.log(`\nResults:`);
  console.log(`Total Time: ${totalTime.toFixed(2)}ms`);
  console.log(`Average Time per Request: ${avgTime.toFixed(2)}ms`);

  // Cleanup
  if (typeof (scraperService as any).onModuleDestroy === 'function') {
    await (scraperService as any).onModuleDestroy();
  }

  server.close();
  process.exit(0);
}

runBenchmark().catch(console.error);
