import { Injectable, Logger } from '@nestjs/common';
import puppeteer from 'puppeteer';
import type { Browser } from 'puppeteer';
import * as dns from 'dns/promises';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  private async isSafeUrl(urlStr: string): Promise<boolean> {
    try {
      const parsedUrl = new URL(urlStr);

      // Only allow HTTP/HTTPS
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return false;
      }

      // Resolve DNS to IP
      const { address } = await dns.lookup(parsedUrl.hostname);

      // Block SSRF IPs (Loopback, private, cloud metadata)
      const ipParts = address.split('.').map(Number);

      // Block 0.0.0.0/8, 127.0.0.0/8
      if (ipParts[0] === 0 || ipParts[0] === 127) return false;
      // Block 10.0.0.0/8
      if (ipParts[0] === 10) return false;
      // Block 172.16.0.0/12
      if (ipParts[0] === 172 && ipParts[1] >= 16 && ipParts[1] <= 31)
        return false;
      // Block 192.168.0.0/16
      if (ipParts[0] === 192 && ipParts[1] === 168) return false;
      // Block 169.254.0.0/16
      if (ipParts[0] === 169 && ipParts[1] === 254) return false;

      // Block IPv6 loopback and unspecified
      if (address === '::1' || address === '::') return false;

      return true;
    } catch {
      return false; // Invalid URL or DNS resolution failed
    }
  }

  async scrapeCompany(url: string): Promise<Record<string, unknown>> {
    this.logger.log(`Scraping URL: ${url}`);

    if (!(await this.isSafeUrl(url))) {
      throw new Error('Invalid or blocked URL provided');
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
