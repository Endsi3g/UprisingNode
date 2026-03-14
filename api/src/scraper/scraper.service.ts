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
      const parsedUrl = new URL(urlString);

      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return false;
      }

      const hostname = parsedUrl.hostname;

      if (
        hostname === 'localhost' ||
        hostname.startsWith('127.') ||
        hostname.startsWith('169.254.') || // Cloud Metadata
        hostname.startsWith('10.') ||
        hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./) ||
        hostname.startsWith('192.168.') ||
        hostname === '[::1]'
      ) {
        return false;
      }

      return true;
    } catch {
      return false; // Invalid URL format
    }
  }

  async scrapeCompany(url: string): Promise<ScrapedData> {
    if (!this.isSafeUrl(url)) {
      this.logger.warn(`Attempted to scrape unsafe URL: ${url}`);
      throw new BadRequestException('Invalid or restricted URL provided');
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
      return data as ScrapedData;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; // Re-throw validation errors directly
      }
      const e = error as Error;
      this.logger.error(`Failed to scrape ${url}`, e.stack);
      throw new BadRequestException(
        'Failed to extract data from the provided URL',
      );
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
