import { Injectable, Logger } from '@nestjs/common';
import type { Browser, HTTPRequest } from 'puppeteer';
import puppeteer from 'puppeteer';
import * as dns from 'dns/promises';
import * as net from 'net';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  private async isSafeUrl(urlString: string): Promise<boolean> {
    try {
      const parsedUrl = new URL(urlString);

      // Only allow http and https
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return false;
      }

      const hostname = parsedUrl.hostname;

      // Resolve hostname to IP
      const lookupResult = await dns.lookup(hostname);
      const address = lookupResult.address;

      if (!address) {
        return false;
      }

      // Block local/private IPs and cloud metadata
      // IPv4 ranges: 0.0.0.0/8, 10.0.0.0/8, 127.0.0.0/8, 169.254.0.0/16, 172.16.0.0/12, 192.168.0.0/16
      // IPv6: ::1, and IPv4-mapped IPv6
      if (net.isIPv4(address)) {
        const parts = address.split('.').map(Number);
        if (
          parts[0] === 0 || // 0.0.0.0/8
          parts[0] === 10 || // 10.0.0.0/8
          parts[0] === 127 || // 127.0.0.0/8
          (parts[0] === 169 && parts[1] === 254) || // 169.254.0.0/16
          (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || // 172.16.0.0/12
          (parts[0] === 192 && parts[1] === 168) // 192.168.0.0/16
        ) {
          return false;
        }
      } else {
        // IPv6
        const lowerAddress = address.toLowerCase();
        if (
          lowerAddress === '::1' ||
          lowerAddress.startsWith('::ffff:127.') ||
          lowerAddress.startsWith('::ffff:169.254.') ||
          lowerAddress.startsWith('::ffff:10.') ||
          lowerAddress.startsWith('::ffff:192.168.') ||
          lowerAddress.startsWith('::ffff:0.') ||
          lowerAddress.startsWith('fe80:')
        ) {
          return false;
        }
      }

      return true;
    } catch {
      return false; // Fail secure if parsing or DNS lookup fails
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
            await request.abort('accessdenied');
            return;
          }
          await request.continue();
        } catch {
          if (!request.isInterceptResolutionHandled()) {
            await request.abort('failed');
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
