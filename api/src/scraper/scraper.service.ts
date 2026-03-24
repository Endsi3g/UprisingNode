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

  /**
   * Validates if a URL is safe to scrape, preventing SSRF attacks.
   * Blocks internal IPs, localhost, and metadata endpoints.
   */
  private isSafeUrl(urlStr: string): boolean {
    try {
      const parsedUrl = new URL(urlStr);

      // Only allow HTTP/HTTPS
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return false;
      }

      const hostname = parsedUrl.hostname;

      // Block exact matches for common internal/private addresses
      const blockedHostnames = [
        'localhost',
        '127.0.0.1',
        '0.0.0.0',
        '::1',
        '169.254.169.254', // AWS/cloud metadata
        '[::1]',
      ];

      if (
        blockedHostnames.includes(hostname) ||
        hostname.endsWith('.localhost')
      ) {
        return false;
      }

      // Block private IPv4 ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
      // This is a basic string matching block. A more robust solution might use an IP parsing library.
      if (
        hostname.startsWith('10.') ||
        hostname.startsWith('192.168.') ||
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
      ) {
        return false;
      }

      return true;
    } catch {
      return false; // Invalid URL string
    }
  }

  async scrapeCompany(url: string): Promise<ScrapedData> {
    if (!this.isSafeUrl(url)) {
      this.logger.warn(`SSRF attempt blocked for URL: ${url}`);
      throw new BadRequestException('Invalid or unsafe URL provided.');
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
