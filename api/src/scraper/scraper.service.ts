import { Injectable, Logger, BadRequestException } from '@nestjs/common';

import type { Browser } from 'puppeteer';
import puppeteer from 'puppeteer';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  /**
   * Validates if the given URL is safe to scrape, preventing SSRF attacks.
   */
  private isSafeUrl(urlStr: string): boolean {
    try {
      const parsedUrl = new URL(urlStr);

      // 1. Only allow HTTP and HTTPS
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return false;
      }

      const hostname = parsedUrl.hostname;

      // 2. Block localhost and loopback addresses (IPv4 and IPv6)
      if (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '[::1]'
      ) {
        return false;
      }

      // 3. Block private IP ranges (10.x.x.x, 172.16.x.x to 172.31.x.x, 192.168.x.x)
      // Check for IPv4 format
      const ipParts = hostname.split('.');
      if (ipParts.length === 4) {
        const p1 = parseInt(ipParts[0], 10);
        const p2 = parseInt(ipParts[1], 10);

        if (p1 === 10) return false;
        if (p1 === 172 && p2 >= 16 && p2 <= 31) return false;
        if (p1 === 192 && p2 === 168) return false;

        // 4. Block cloud metadata endpoints (169.254.169.254)
        if (p1 === 169 && p2 === 254) return false;
      }

      return true;
    } catch {
      return false; // Invalid URL
    }
  }

  async scrapeCompany(url: string): Promise<Record<string, unknown>> {
    this.logger.log(`Scraping URL: ${url}`);

    // Security check: validate the URL to prevent SSRF
    if (!this.isSafeUrl(url)) {
      this.logger.warn(`Rejected unsafe URL for scraping: ${url}`);
      throw new BadRequestException('Invalid or blocked URL provided');
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
      return data as Record<string, unknown>;
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
