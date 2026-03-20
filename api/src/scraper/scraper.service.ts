import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import type { Browser } from 'puppeteer';

export interface ScrapedData {
  title: string;
  description: string;
  headings: string[];
}

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  // 🛡️ Sentinel: Validate URL to prevent SSRF
  private isSafeUrl(urlString: string): boolean {
    try {
      const parsedUrl = new URL(urlString);

      // Only allow http/https
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return false;
      }

      const hostname = parsedUrl.hostname;

      // Block common private/internal/metadata IPs and hostnames
      const blockedHostnames = [
        'localhost',
        '127.0.0.1',
        '::1',
        '169.254.169.254', // AWS Metadata IP
        'metadata.google.internal', // GCP Metadata
      ];

      // Block local subnets like 10.x.x.x, 172.16.x.x-172.31.x.x, 192.168.x.x
      const isPrivateIp =
        /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
        /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
        /^172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname);

      if (blockedHostnames.includes(hostname) || isPrivateIp) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  async scrapeCompany(url: string): Promise<ScrapedData> {
    this.logger.log(`Scraping URL: ${url}`);

    // 🛡️ Sentinel: Check URL safety before navigation
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
