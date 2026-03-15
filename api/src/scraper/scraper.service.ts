import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';

// Basic SSRF protection
function isSafeUrl(urlString: string): boolean {
  try {
    const parsedUrl = new URL(urlString);

    // Only allow HTTP(S) protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }

    const hostname = parsedUrl.hostname;

    // Block common private, internal, and metadata IP addresses
    // This is a basic blocklist and might not cover all edge cases (like IPv6 variants or encoded IPs)
    const blockedIPsAndHosts = [
      '127.0.0.1',
      'localhost',
      '169.254.169.254', // AWS/GCP/Azure metadata
      '[::1]',
      '0.0.0.0',
    ];

    if (blockedIPsAndHosts.includes(hostname)) {
      return false;
    }

    // Additional check for IP ranges can be implemented here if needed.
    return true;
  } catch {
    return false; // Invalid URL
  }
}

// Define the return type to satisfy the linter
export interface ScrapedData {
  title: string;
  description: string;
  headings: string[];
}

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  async scrapeCompany(url: string): Promise<ScrapedData> {
    this.logger.log(`Scraping URL: ${url}`);

    if (!isSafeUrl(url)) {
      throw new BadRequestException('Invalid or blocked URL provided.');
    }

    let browser: Browser | undefined;
    try {
      browser = await puppeteer.launch({
        headless: true, // Run in headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some environments
      });

      const page: Page = await browser.newPage();

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
      if (e instanceof BadRequestException) {
        throw e;
      }
      this.logger.error(`Failed to scrape ${url}`, e.stack);
      throw new Error(`Scraping failed: ${e.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
