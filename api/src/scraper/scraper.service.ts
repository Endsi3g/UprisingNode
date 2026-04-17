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
      if (!['http:', 'https:'].includes(url.protocol)) return false;

      const hostname = url.hostname;
      let address = hostname;
      if (!net.isIP(hostname)) {
        const lookup = await dns.lookup(hostname);
        address = lookup.address;
      }

      if (net.isIPv4(address)) {
        const p = address.split('.').map(Number);
        if (
          p[0] === 10 ||
          p[0] === 127 ||
          p[0] === 0 ||
          p[0] === 169 ||
          (p[0] === 172 && p[1] >= 16 && p[1] <= 31) ||
          (p[0] === 192 && p[1] === 168)
        )
          return false;
      } else {
        const lower = address.toLowerCase();
        if (
          lower === '::1' ||
          lower.startsWith('fc') ||
          lower.startsWith('fd') ||
          lower.startsWith('fe8') ||
          lower.startsWith('fe9') ||
          lower.startsWith('fea') ||
          lower.startsWith('feb') ||
          lower.startsWith('::ffff:')
        )
          return false;
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
          const isSafe = await this.isSafeUrl(request.url());
          if (!request.isInterceptResolutionHandled()) {
            if (isSafe) {
              await request.continue();
            } else {
              await request.abort();
            }
          }
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
