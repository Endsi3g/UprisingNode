import { Injectable, Logger } from '@nestjs/common';

import puppeteer from 'puppeteer';
import type { Browser } from 'puppeteer';

export interface ScrapedData {
  title: string;
  description: string;
  headings: string[];
}

function isSafeUrl(urlString: string): boolean {
  try {
    const parsedUrl = new URL(urlString);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return false;
    }
    const hostname = parsedUrl.hostname.toLowerCase();

    // Block common internal network hosts and metadata endpoints
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1'
    )
      return false;
    if (hostname === '169.254.169.254') return false;

    // Block private IP ranges
    const isPrivateIp =
      /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
      /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname);
    if (isPrivateIp) return false;

    // Additional check to prevent .local resolving
    if (hostname.endsWith('.local')) return false;

    return true;
  } catch {
    return false;
  }
}

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  async scrapeCompany(url: string): Promise<ScrapedData> {
    if (!isSafeUrl(url)) {
      this.logger.warn(`Blocked attempt to scrape unsafe URL: ${url}`);
      throw new Error('Invalid or unsafe URL provided.');
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

      const data = await page.evaluate((): ScrapedData => {
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
