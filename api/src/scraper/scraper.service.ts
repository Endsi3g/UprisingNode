import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import type { Browser } from 'puppeteer';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  private isSafeUrl(urlString: string): boolean {
    try {
      const parsedUrl = new URL(urlString);

      // Only allow HTTP/HTTPS protocols
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return false;
      }

      const hostname = parsedUrl.hostname.toLowerCase();

      // Block localhost
      if (hostname === 'localhost' || hostname === '[::1]') {
        return false;
      }

      // IPv4 validation
      const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
      const match = hostname.match(ipv4Regex);

      if (match) {
        const octets = [
          parseInt(match[1], 10),
          parseInt(match[2], 10),
          parseInt(match[3], 10),
          parseInt(match[4], 10),
        ];

        // Ensure valid IP address format
        if (octets.some((octet) => octet > 255)) {
          return false; // Invalid IP, but we can just block it
        }

        const [o1, o2] = octets;

        // Block 127.0.0.0/8 (Loopback)
        // Block 0.0.0.0/8 (Current network)
        if (o1 === 127 || o1 === 0) return false;

        // Block 10.0.0.0/8 (Private network)
        if (o1 === 10) return false;

        // Block 172.16.0.0/12 (Private network)
        if (o1 === 172 && o2 >= 16 && o2 <= 31) return false;

        // Block 192.168.0.0/16 (Private network)
        if (o1 === 192 && o2 === 168) return false;

        // Block 169.254.0.0/16 (Link-local, often used for cloud metadata)
        if (o1 === 169 && o2 === 254) return false;
      }

      return true;
    } catch {
      return false; // Invalid URL format
    }
  }

  async scrapeCompany(url: string): Promise<Record<string, unknown>> {
    this.logger.log(`Scraping URL: ${url}`);

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
      return data as Record<string, unknown>;
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
