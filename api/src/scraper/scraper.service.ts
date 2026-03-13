import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer from 'puppeteer';

function isSafeUrl(urlString: string): boolean {
  try {
    const parsedUrl = new URL(urlString);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) return false;

    const hostname = parsedUrl.hostname.toLowerCase();

    // Block local and private IP ranges
    const isLocalhost = hostname === 'localhost' || hostname.endsWith('.local');
    const isPrivateIp =
      /^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(
        hostname,
      );
    // Block IPv6 localhost and 0.0.0.0 / [::] routing
    const isIPv6Local =
      hostname === '[::1]' ||
      hostname === '::1' ||
      hostname === '[::]' ||
      hostname === '::';
    const isZeroRouting = hostname === '0.0.0.0';

    if (isLocalhost || isPrivateIp || isIPv6Local || isZeroRouting)
      return false;

    return true;
  } catch {
    return false;
  }
}

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  async scrapeCompany(url: string): Promise<any> {
    this.logger.log(`Scraping URL: ${url}`);

    if (!isSafeUrl(url)) {
      this.logger.warn(`Blocked unsafe URL attempt: ${url}`);
      throw new BadRequestException('Invalid or unsafe URL provided');
    }

    let browser: any;
    try {
      browser = await puppeteer.launch({
        headless: true, // Run in headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some environments
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const page = await browser.newPage();

      // Navigate to the URL
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Extract data
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
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
      if (error instanceof BadRequestException) {
        throw error;
      }

      const e = error as Error;
      this.logger.error(`Failed to scrape ${url}`);
      throw new Error(`Scraping failed: ${e.message}`);
    } finally {
      if (browser) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        await browser.close();
      }
    }
  }
}
