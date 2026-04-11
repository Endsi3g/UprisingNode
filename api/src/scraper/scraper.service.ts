import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import type { Browser, HTTPRequest } from 'puppeteer';
import * as dns from 'dns/promises';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  private async isSafeUrl(urlString: string): Promise<boolean> {
    try {
      const parsedUrl = new URL(urlString);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return false;
      }
      const { address } = await dns.lookup(parsedUrl.hostname);

      const isIPv4 = address.includes('.');
      if (isIPv4) {
        const parts = address.split('.').map(Number);
        if (
          parts[0] === 0 || // 0.0.0.0/8
          parts[0] === 127 || // 127.0.0.0/8 loopback
          parts[0] === 10 || // 10.0.0.0/8 private
          (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || // 172.16.0.0/12 private
          (parts[0] === 192 && parts[1] === 168) || // 192.168.0.0/16 private
          (parts[0] === 169 && parts[1] === 254) // 169.254.0.0/16 cloud metadata/link-local
        ) {
          return false;
        }
      } else {
        const addr = address.toLowerCase();
        if (
          addr === '::1' || // loopback
          addr.startsWith('fc') || // fc00::/7 unique local
          addr.startsWith('fd') || // fc00::/7 unique local
          addr.startsWith('fe80') || // link-local
          addr.startsWith('::ffff:127.') || // IPv4-mapped loopback
          addr.startsWith('::ffff:169.254.') || // IPv4-mapped metadata
          addr.startsWith('::ffff:10.') || // IPv4-mapped private
          addr.startsWith('::ffff:192.168.') || // IPv4-mapped private
          addr.match(/^::ffff:172\.(1[6-9]|2[0-9]|3[0-1])\./) ||
          addr.match(/^::ffff:0\./)
        ) {
          return false;
        }
      }

      return true;
    } catch (err) {
      this.logger.error(
        `Error resolving URL for safety check: ${urlString}`,
        err instanceof Error ? err.stack : undefined,
      );
      return false;
    }
  }

  async scrapeCompany(url: string): Promise<Record<string, unknown>> {
    if (!(await this.isSafeUrl(url))) {
      this.logger.warn(`SSRF attempt detected or invalid URL: ${url}`);
      throw new BadRequestException('Invalid or unsafe URL provided');
    }

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
        const reqUrl = request.url();
        // Ignore data URLs

        if (reqUrl.startsWith('data:')) {
          await request.continue();
          return;
        }

        if (!(await this.isSafeUrl(reqUrl))) {
          this.logger.warn(`SSRF blocked via interception for URL: ${reqUrl}`);

          await request.abort();
        } else {
          await request.continue();
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
