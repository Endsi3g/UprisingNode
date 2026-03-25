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

      // Block localhost and specific internal/metadata IPs
      // Node's URL parses IPv6 literal like "http://[::1]" as "[::1]"
      const blockedHostnames = ['localhost', '::1', '[::1]'];
      const blockedIPRanges = [
        /^127\./,           // Loopback
        /^10\./,            // Class A private
        /^192\.168\./,      // Class C private
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // Class B private
        /^169\.254\.169\.254$/ // AWS metadata
      ];

      if (blockedHostnames.includes(hostname)) {
        return false;
      }

      if (blockedIPRanges.some(regex => regex.test(hostname))) {
        return false;
      }

      return true;
    } catch {
      return false; // Invalid URL
    }
  }

  async scrapeCompany(url: string): Promise<ScrapedData> {
    this.logger.log(`Scraping URL: ${url}`);

    if (!this.isSafeUrl(url)) {
      throw new BadRequestException('Invalid or unsafe URL provided');
    }

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
      const data = await page.evaluate(() => {
        const title = document.title;
        const description =
          document
            .querySelector('meta[name="description"]')
            ?.getAttribute('content') || '';
        const headings = Array.from(document.querySelectorAll('h1, h2'))
          .map((h) => h.textContent?.trim())
          .filter(Boolean) as string[];

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
