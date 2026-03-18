import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';
import { URL } from 'url';

export interface ScrapedData {
  title: string;
  description: string;
  headings: string[];
}

function isSafeUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);

    // Only allow http and https
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }

    const hostname = url.hostname;

    // Block private and reserved IP addresses, and metadata endpoints
    const forbiddenHostnames = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '::1',
      '169.254.169.254', // AWS/GCP/Azure metadata
      '[::1]',
    ];

    if (forbiddenHostnames.includes(hostname)) {
      return false;
    }

    // Basic regex for IPv4 loopback, private, and link-local addresses
    // Match only numeric IPs to prevent false positives like '10.example.com'
    const ipv4Regex =
      /^(127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+|192\.168\.\d+\.\d+|169\.254\.\d+\.\d+)$/;
    if (ipv4Regex.test(hostname)) {
      return false;
    }

    // Basic check for IPv6 localhost/private
    // Note: Node's URL.hostname wraps IPv6 addresses in brackets
    if (
      hostname.includes('::1') ||
      hostname.startsWith('[fd') ||
      hostname.startsWith('[fc')
    ) {
      return false;
    }

    return true;
  } catch {
    return false; // Invalid URL format
  }
}

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  async scrapeCompany(url: string): Promise<ScrapedData> {
    if (!isSafeUrl(url)) {
      this.logger.warn(`Blocked attempt to scrape unsafe URL: ${url}`);
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
