import { Injectable, Logger } from '@nestjs/common';
import puppeteer from 'puppeteer';
import type { Browser, HTTPRequest } from 'puppeteer';
import * as dns from 'dns/promises';
import * as net from 'net';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  private async isSafeUrl(urlString: string): Promise<boolean> {
    try {
      const url = new URL(urlString);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;

      const { address: ip } = await dns.lookup(url.hostname);

      if (net.isIPv4(ip)) {
        const parts = ip.split('.').map(Number);
        if (
          parts[0] === 0 ||
          parts[0] === 127 ||
          parts[0] === 10 ||
          (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
          (parts[0] === 192 && parts[1] === 168) ||
          (parts[0] === 169 && parts[1] === 254)
        ) {
          return false;
        }
      } else {
        if (ip === '::1') return false;
        if (ip.startsWith('::ffff:')) {
          const ipv4Part = ip.substring(7);
          const parts = ipv4Part.split('.').map(Number);
          if (
            parts[0] === 0 ||
            parts[0] === 127 ||
            parts[0] === 10 ||
            (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
            (parts[0] === 192 && parts[1] === 168) ||
            (parts[0] === 169 && parts[1] === 254)
          ) {
            return false;
          }
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  async scrapeCompany(url: string): Promise<Record<string, unknown>> {
    this.logger.log(`Scraping URL: ${url}`);

    let browser: Browser | undefined;
    try {
      browser = await puppeteer.launch({
        headless: true, // Run in headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some environments
      });

      const page = await browser.newPage();

      await page.setRequestInterception(true);
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      page.on('request', async (request: HTTPRequest) => {
        try {
          if (request.isInterceptResolutionHandled()) return;
          const isSafe = await this.isSafeUrl(request.url());
          if (!isSafe) {
            this.logger.warn(`Blocked unsafe request: ${request.url()}`);
            await request.abort();
            return;
          }
          await request.continue();
        } catch {
          if (!request.isInterceptResolutionHandled()) {
            await request.abort();
          }
        }
      });

      // Navigate to the URL
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Extract data
      const data = (await page.evaluate(() => {
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
      })) as Record<string, unknown>;

      this.logger.log(`Successfully scraped data for ${url}`);
      return data;
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Failed to scrape ${url}`, err.stack);
      throw new Error(`Scraping failed: ${err.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
