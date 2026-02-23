import { Injectable, Logger } from '@nestjs/common';
import puppeteer, { Browser, HTTPRequest } from 'puppeteer';
import * as dns from 'dns/promises';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  private async validateUrl(url: string): Promise<void> {
    const parsedUrl = new URL(url);

    // Allow data URIs (safe, no network request)
    if (parsedUrl.protocol === 'data:') return;

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Invalid protocol');
    }

    const { address } = await dns.lookup(parsedUrl.hostname);
    if (
      address === '0.0.0.0' ||
      address.startsWith('127.') ||
      address.startsWith('10.') ||
      address.startsWith('192.168.') ||
      address.startsWith('169.254.') ||
      (address.startsWith('172.') &&
        parseInt(address.split('.')[1], 10) >= 16 &&
        parseInt(address.split('.')[1], 10) <= 31) ||
      address === '::1' ||
      address.toLowerCase().startsWith('fc') ||
      address.toLowerCase().startsWith('fe80:') ||
      address.toLowerCase().startsWith('::ffff:')
    ) {
      throw new Error('Access to private IP is restricted');
    }
  }

  async scrapeCompany(url: string): Promise<any> {
    this.logger.log(`Scraping URL: ${url}`);

    await this.validateUrl(url);

    let browser: Browser | undefined;
    try {
      browser = await puppeteer.launch({
        headless: true, // Run in headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some environments
      });

      const page = await browser.newPage();

      await page.setRequestInterception(true);
      page.on('request', (req: HTTPRequest) => {
        // Handle async logic without returning a promise to the event emitter
        void (async () => {
          try {
            await this.validateUrl(req.url());
            await req.continue();
          } catch {
            await req.abort();
          }
        })();
      });

      // Navigate to the URL
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Extract data
      const data = await page.evaluate(() => {
        const title = document.title;
        const description =
          document
            .querySelector('meta[name="description"]')
            ?.getAttribute('content') || '';
        const headings = Array.from(document.querySelectorAll('h1, h2'))
          .map((h) => h.textContent?.trim())
          .filter(Boolean);

        return {
          title,
          description,
          headings,
        };
      });

      this.logger.log(`Successfully scraped data for ${url}`);
      return data;
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`Failed to scrape ${url}`, error.stack);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Scraping failed: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
