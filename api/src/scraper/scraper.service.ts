import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import type { Browser } from 'puppeteer';
import puppeteer from 'puppeteer';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  private isSafeUrl(urlStr: string): boolean {
    try {
      const url = new URL(urlStr);

      // Allow only http and https
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return false;
      }

      const hostname = url.hostname;

      // Block localhost
      if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
        return false;
      }

      // Basic IP blocklist
      const ipv4Regex = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
      const ipv4Match = hostname.match(ipv4Regex);

      if (ipv4Match) {
        const parts = ipv4Match.slice(1).map(Number);
        if (
          parts[0] === 127 || // Loopback
          parts[0] === 10 || // Class A private
          (parts[0] === 169 && parts[1] === 254) || // Link-local
          (parts[0] === 192 && parts[1] === 168) || // Class C private
          (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || // Class B private
          parts[0] === 0 || // Current network
          parts[0] === 255 || // Broadcast
          parts[0] === 224 || // Multicast
          parts[0] === 239 // Multicast
        ) {
          return false;
        }
      }

      // Basic IPv6 blocklist
      if (
        hostname === '[::1]' ||
        hostname.startsWith('[fc') ||
        hostname.startsWith('[fd')
      ) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  async scrapeCompany(url: string): Promise<Record<string, unknown>> {
    if (!this.isSafeUrl(url)) {
      this.logger.warn(`Rejected unsafe URL: ${url}`);
      throw new BadRequestException('Invalid or unsafe URL provided');
    }

    this.logger.log(`Scraping URL: ${url}`);

    let browser: Browser | null = null;
    try {
      browser = await puppeteer.launch({
        headless: true, // Run in headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some environments
      });

      const page = await browser.newPage();

      // Navigate to the URL
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Extract data
      const data = await page.evaluate((): Record<string, unknown> => {
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
    } catch (error) {
      const e = error as Error;
      this.logger.error(`Failed to scrape ${url}`, e.stack);
      throw new Error(`Scraping failed: ${e.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
