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

  private isSafeUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);

      // Only allow http and https
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return false;
      }

      const hostname = parsedUrl.hostname;

      // Block common internal/metadata IP addresses and hostnames
      const blockedHostnames = [
        'localhost',
        '127.0.0.1',
        '::1',
        '169.254.169.254',
        '[::1]',
      ];

      if (blockedHostnames.includes(hostname)) {
        return false;
      }

      // Block private IP ranges (10.x.x.x, 172.16.x.x-172.31.x.x, 192.168.x.x)
      const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
      const match = hostname.match(ipRegex);
      if (match) {
        const p1 = parseInt(match[1], 10);
        const p2 = parseInt(match[2], 10);
        if (
          p1 === 10 ||
          (p1 === 172 && p2 >= 16 && p2 <= 31) ||
          (p1 === 192 && p2 === 168)
        ) {
          return false;
        }
      }

      return true;
    } catch {
      return false; // Invalid URL format
    }
  }

  async scrapeCompany(url: string): Promise<ScrapedData> {
    if (!this.isSafeUrl(url)) {
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
          .map((h) => h.textContent?.trim() || '')
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
      if (e instanceof BadRequestException) {
        throw e;
      }
      throw new Error(`Scraping failed: ${e.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
