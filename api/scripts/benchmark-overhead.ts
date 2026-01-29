
import puppeteer from 'puppeteer';

async function benchmark() {
  console.log('Measuring overhead...');

  // Measure Launch + Page
  const startLaunch = Date.now();
  const browser2 = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page2 = await browser2.newPage();
  await page2.goto('about:blank');
  await browser2.close();
  const durationLaunch = Date.now() - startLaunch;
  console.log(`Baseline (Launch per request): ${durationLaunch}ms`);

  // Measure Context (Reuse Browser)
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });

  const startContext = Date.now();
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await page.goto('about:blank');
  await context.close();
  const durationContext = Date.now() - startContext;
  console.log(`Optimized (Reuse Browser + Context): ${durationContext}ms`);

  await browser.close();
}

benchmark();
