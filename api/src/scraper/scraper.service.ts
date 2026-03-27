import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import type { Browser } from 'puppeteer';

export interface ScrapedData {
  title: string;
  description: string;
  headings: string[];
}

function isSafeUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }

    // Block local/private IPs and metadata endpoints (basic SSRF protection)
    const hostname = url.hostname;
    const isPrivate =
      hostname === 'localhost' ||
      hostname.startsWith('127.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./) ||
      hostname === '169.254.169.254' || // AWS metadata
      hostname.endsWith('.local') ||
      hostname.includes('internal');

    return !isPrivate;
  } catch {
    return false;
  }
}

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  async scrapeCompany(url: string): Promise<ScrapedData> {
    this.logger.log(`Scraping URL: ${url}`);

    if (!isSafeUrl(url)) {
      throw new BadRequestException('Invalid or unsafe URL provided.');
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
