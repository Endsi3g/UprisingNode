import { Injectable, Logger } from '@nestjs/common';
import puppeteer from 'puppeteer';
import type { Browser, HTTPRequest } from 'puppeteer';
import * as dns from 'dns/promises';
import * as net from 'net';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  private async isSafeUrl(targetUrl: string): Promise<boolean> {
    try {
      const parsedUrl = new URL(targetUrl);

      // Only allow HTTP/HTTPS
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return false;
      }

      const hostname = parsedUrl.hostname;

      // Resolve IP
      const { address } = await dns.lookup(hostname);

      // Block local/private IPs and cloud metadata
      const isIPv4 = net.isIPv4(address);
      if (isIPv4) {
        if (
          address.startsWith('127.') ||
          address.startsWith('10.') ||
          address.startsWith('192.168.') ||
          address.startsWith('169.254.') || // Cloud Metadata
          address.startsWith('0.') || // 0.0.0.0/8
          address.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)
        ) {
          return false;
        }
      } else if (net.isIPv6(address)) {
        if (
          address === '::1' ||
          address.toLowerCase().startsWith('fc00:') ||
          address.toLowerCase().startsWith('fd00:') ||
          address.toLowerCase().startsWith('fe80:') ||
          address.toLowerCase().startsWith('::ffff:127.') || // IPv4-mapped loopback
          address.toLowerCase().startsWith('::ffff:169.254.') || // IPv4-mapped cloud metadata
          address.toLowerCase().startsWith('::ffff:10.') ||
          address.toLowerCase().startsWith('::ffff:192.168.') ||
          address.toLowerCase().startsWith('::ffff:0.')
        ) {
          return false;
        }
      }

      return true;
    } catch {
      return false; // Fail safe
    }
  }

  async scrapeCompany(url: string): Promise<Record<string, unknown>> {
    this.logger.log(`Scraping URL: ${url}`);

    if (!(await this.isSafeUrl(url))) {
      throw new Error('Unsafe URL provided');
    }

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

          if (!(await this.isSafeUrl(request.url()))) {
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
