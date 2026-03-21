import { Injectable, Logger } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';

export interface ScrapedData {
  title: string;
  description: string;
  headings: string[];
}

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  private isSafeUrl(urlString: string): boolean {
    try {
      const parsedUrl = new URL(urlString);

      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return false;
      }

      // Block local/private IPs and common metadata domains
      const hostname = parsedUrl.hostname;
      const blockedHostnames = [
        'localhost',
        '169.254.169.254',
        'metadata.google.internal',
      ];

      // Basic check for private IP ranges (IPv4)
      const ipParts = hostname.split('.');
      if (
        ipParts.length === 4 &&
        ipParts.every((part) => !isNaN(Number(part)))
      ) {
        const firstOctet = parseInt(ipParts[0], 10);
        const secondOctet = parseInt(ipParts[1], 10);

        if (
          firstOctet === 10 || // 10.0.0.0/8
          firstOctet === 127 || // 127.0.0.0/8 (loopback)
          (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) || // 172.16.0.0/12
          (firstOctet === 192 && secondOctet === 168) // 192.168.0.0/16
        ) {
          return false;
        }
      }

      // Block known hostnames
      if (blockedHostnames.includes(hostname)) {
        return false;
      }

      return true;
    } catch {
      // If URL parsing fails, it's not safe
      return false;
    }
  }

  async scrapeCompany(url: string): Promise<ScrapedData> {
    this.logger.log(`Scraping URL: ${url}`);

    if (!this.isSafeUrl(url)) {
      this.logger.warn(`Blocked attempt to scrape unsafe URL: ${url}`);
      throw new Error('Invalid or unsafe URL provided.');
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
