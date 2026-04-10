import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import * as dns from 'dns/promises';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  private async isSafeUrl(urlString: string): Promise<boolean> {
    try {
      const url = new URL(urlString);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return false;
      }

      const { address, family } = await dns.lookup(url.hostname);

      if (family === 4) {
        if (
          address.startsWith('127.') ||
          address.startsWith('10.') ||
          address.startsWith('192.168.') ||
          address.startsWith('169.254.') ||
          address.startsWith('0.')
        ) {
          return false;
        }
        if (address.startsWith('172.')) {
          const secondOctet = parseInt(address.split('.')[1], 10);
          if (secondOctet >= 16 && secondOctet <= 31) {
            return false;
          }
        }
      } else if (family === 6) {
        const lowerAddr = address.toLowerCase();
        if (lowerAddr === '::1' || lowerAddr === '0:0:0:0:0:0:0:1') {
          return false;
        }
        if (
          lowerAddr.startsWith('fc') ||
          lowerAddr.startsWith('fd') ||
          lowerAddr.startsWith('fe8') ||
          lowerAddr.startsWith('fe9') ||
          lowerAddr.startsWith('fea') ||
          lowerAddr.startsWith('feb') ||
          lowerAddr.startsWith('::ffff:127.') ||
          lowerAddr.startsWith('::ffff:10.') ||
          lowerAddr.startsWith('::ffff:192.168.') ||
          lowerAddr.startsWith('::ffff:169.254.') ||
          lowerAddr.startsWith('::ffff:0.')
        ) {
          return false;
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  async scrapeCompany(url: string): Promise<Record<string, unknown>> {
    this.logger.log(`Scraping URL: ${url}`);

    const isSafe = await this.isSafeUrl(url);
    if (!isSafe) {
      this.logger.warn(`Attempted SSRF blocked for URL: ${url}`);
      throw new BadRequestException('Invalid or blocked URL provided');
    }

    let browser: import('puppeteer').Browser | undefined;
    try {
      browser = await puppeteer.launch({
        headless: true, // Run in headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some environments
      });

      const page = await browser.newPage();

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
