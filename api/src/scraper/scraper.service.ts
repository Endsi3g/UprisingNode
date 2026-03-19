import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';

export interface ScrapedData {
  title: string;
  description: string;
  headings: string[];
}

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  private isSafeUrl(urlString: string): boolean {
    try {
      const url = new URL(urlString);

      // Enforce HTTP/HTTPS protocols
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return false;
      }

      const hostname = url.hostname;

      // Block common internal hostnames
      if (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '[::1]'
      ) {
        return false;
      }

      // Block common internal IP ranges and AWS metadata
      // The regexes are anchored to the start and match either the end of the string or a dot
      // to avoid false positives on domains like 10.co.uk or 192.168.com
      const forbiddenIPs = [
        /^10(\.|$)/,
        /^172\.(1[6-9]|2[0-9]|3[0-1])(\.|$)/,
        /^192\.168(\.|$)/,
        /^169\.254(\.|$)/, // AWS metadata
        /^0(\.|$)/, // "0.0.0.0"
      ];

      return !forbiddenIPs.some((pattern) => pattern.test(hostname));
    } catch {
      return false; // Invalid URL
    }
  }

  async scrapeCompany(url: string): Promise<ScrapedData> {
    if (!this.isSafeUrl(url)) {
      throw new BadRequestException('Invalid or forbidden URL');
    }

    this.logger.log(`Scraping URL: ${url}`);

    let browser: Browser | undefined;
    try {
      browser = await puppeteer.launch({
        headless: true, // Run in headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some environments
      });

      const page = await browser.newPage();

      // Navigate to the URL
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Extract data

      const data: ScrapedData = await page.evaluate(() => {
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
