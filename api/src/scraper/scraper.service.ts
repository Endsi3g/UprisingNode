import { Injectable, Logger } from '@nestjs/common';
import puppeteer from 'puppeteer';
import type { Browser, HTTPRequest } from 'puppeteer';
import * as dns from 'dns/promises';
import * as net from 'net';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  private async isSafeUrl(urlStr: string): Promise<boolean> {
    try {
      const parsed = new URL(urlStr);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return false;
      }

      const hostname = parsed.hostname;
      const lookup = await dns.lookup(hostname);
      const ip = lookup.address;

      if (net.isIPv4(ip)) {
        if (
          ip.startsWith('127.') ||
          ip.startsWith('10.') ||
          ip.startsWith('169.254.') ||
          ip.startsWith('0.')
        )
          return false;
        const parts = ip.split('.').map(Number);
        if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return false;
        if (parts[0] === 192 && parts[1] === 168) return false;
      } else if (net.isIPv6(ip)) {
        if (ip === '::1') return false;
        if (ip.toLowerCase().startsWith('::ffff:')) {
          const ipv4Part = ip.substring(7);
          if (
            ipv4Part.startsWith('127.') ||
            ipv4Part.startsWith('10.') ||
            ipv4Part.startsWith('169.254.') ||
            ipv4Part.startsWith('0.')
          )
            return false;
          const parts = ipv4Part.split('.').map(Number);
          if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31)
            return false;
          if (parts[0] === 192 && parts[1] === 168) return false;
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

      // Intercept and validate all network requests to prevent SSRF
      await page.setRequestInterception(true);
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      page.on('request', async (request: HTTPRequest) => {
        try {
          if (request.isInterceptResolutionHandled()) return;
          const isSafe = await this.isSafeUrl(request.url());
          if (!isSafe) {
            this.logger.warn(`Blocked unsafe request: ${request.url()}`);
            await request.abort('accessdenied');
          } else {
            await request.continue();
          }
        } catch {
          if (!request.isInterceptResolutionHandled()) {
            await request.abort('failed');
          }
        }
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
      return data as Record<string, unknown>;
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
