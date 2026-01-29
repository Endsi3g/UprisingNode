
import { ScraperService } from '../src/scraper/scraper.service';
import { Logger } from '@nestjs/common';

// Logger.overrideLogger(['error', 'warn']); // Enable all logs

async function benchmark() {
  const service = new ScraperService();
  const iterations = 5;
  const url = 'https://example.com';

  console.log('Initializing service (launching browser)...');
  const initStart = Date.now();
  await service.onModuleInit();
  console.log(`Service initialized in ${Date.now() - initStart}ms`);

  console.log(`Starting benchmark: ${iterations} iterations requesting ${url}`);

  const startTotal = Date.now();
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    try {
      console.log(`Iteration ${i + 1} starting...`);
      await service.scrapeCompany(url);
      const duration = Date.now() - start;
      times.push(duration);
      console.log(`Iteration ${i + 1}: ${duration}ms`);
    } catch (e) {
      console.error(`Iteration ${i + 1} failed:`, e.message);
    }
  }

  const endTotal = Date.now();
  const totalTime = endTotal - startTotal;
  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;

  console.log('\n--- Results ---');
  console.log(`Total Time: ${totalTime}ms`);
  console.log(`Average Time per Request: ${avgTime.toFixed(2)}ms`);

  await service.onModuleDestroy();
}

benchmark();
