import { Injectable, Logger } from '@nestjs/common';
import puppeteer from 'puppeteer';
import type { Browser } from 'puppeteer';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  private isSafeUrl(urlString: string): boolean {
    try {
      const parsedUrl = new URL(urlString);

      // 1. Strictly allow only HTTP and HTTPS
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return false;
      }

      const hostname = parsedUrl.hostname;

      // 2. Block Localhost & Loopback
      if (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '[::1]' ||
        hostname.startsWith('127.') ||
        hostname.endsWith('.localhost')
      ) {
        return false;
      }

      // 3. Block Private Networks (RFC 1918) and Carrier-grade NAT (RFC 6598)
      const ipMatch = hostname.match(
        /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/,
      );
      if (ipMatch) {
        const p1 = parseInt(ipMatch[1], 10);
        const p2 = parseInt(ipMatch[2], 10);

        if (
          p1 === 10 || // 10.0.0.0/8
          (p1 === 172 && p2 >= 16 && p2 <= 31) || // 172.16.0.0/12
          (p1 === 192 && p2 === 168) || // 192.168.0.0/16
          (p1 === 100 && p2 >= 64 && p2 <= 127) // 100.64.0.0/10
        ) {
          return false;
        }
      }

      // 4. Block Cloud Metadata IP (e.g. AWS, GCP, Azure)
      if (hostname === '169.254.169.254' || hostname === '169.254.169.253') {
        return false;
      }

      return true;
    } catch {
      // Invalid URL
      return false;
    }
  }

  async scrapeCompany(url: string): Promise<Record<string, unknown>> {
    if (!this.isSafeUrl(url)) {
      throw new Error('Invalid or unsafe URL provided');
    }

    this.logger.log(`Scraping URL: ${url}`);

    let browser: Browser | undefined;
    try {
      browser = await puppeteer.launch({
        headless: true, // Run in headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some environments
      });

      if (!browser) {
        throw new Error('Failed to launch browser');
      }

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
      const e = error as Error;
      this.logger.error(`Failed to scrape ${url}`, e.message);
      throw new Error(`Scraping failed: ${e.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
