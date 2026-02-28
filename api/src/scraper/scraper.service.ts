import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';
import * as dns from 'dns';
import { promisify } from 'util';

const lookup = promisify(dns.lookup);

export interface ScrapedData {
  title: string;
  description: string;
  headings: string[];
}

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);
  private dnsCache = new Map<string, string>();

  private async isUrlAllowed(targetUrl: string): Promise<boolean> {
    try {
      const parsedUrl = new URL(targetUrl);

      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return false;
      }

      let address = this.dnsCache.get(parsedUrl.hostname);
      if (!address) {
        const result = await lookup(parsedUrl.hostname);
        address = result.address;
        this.dnsCache.set(parsedUrl.hostname, address);
      }

      if (this.isPrivateIp(address)) {
        return false;
      }

      return true;
    } catch {
      return false; // Invalid URL or DNS failure
    }
  }

  private isPrivateIp(ip: string): boolean {
    const parts = ip.split('.');
    if (parts.length === 4) {
      const p1 = parseInt(parts[0], 10);
      const p2 = parseInt(parts[1], 10);

      return (
        p1 === 10 || // 10.0.0.0/8
        (p1 === 172 && p2 >= 16 && p2 <= 31) || // 172.16.0.0/12
        (p1 === 192 && p2 === 168) || // 192.168.0.0/16
        p1 === 127 || // 127.0.0.0/8
        (p1 === 169 && p2 === 254) || // 169.254.0.0/16
        p1 === 0 // 0.0.0.0/8
      );
    }

    if (ip.includes(':')) {
      const lowerIp = ip.toLowerCase();
      return (
        lowerIp === '::1' || // IPv6 localhost
        lowerIp.startsWith('fc00:') || // ULA
        lowerIp.startsWith('fd') || // ULA
        lowerIp.startsWith('fe80:') || // Link-local
        lowerIp.startsWith('::ffff:127.') // IPv4-mapped IPv6 loopback
      );
    }

    return false;
  }

  async scrapeCompany(url: string): Promise<ScrapedData> {
    this.logger.log(`Scraping URL: ${url}`);

    if (!(await this.isUrlAllowed(url))) {
      throw new BadRequestException('Invalid or blocked URL');
    }

    let browser: Browser | undefined;
    try {
      browser = await puppeteer.launch({
        headless: true, // Run in headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some environments
      });

      const page = await browser.newPage();

      await page.setRequestInterception(true);
      page.on('request', (request) => {
        void (async () => {
          try {
            const isAllowed = await this.isUrlAllowed(request.url());
            if (isAllowed) {
              void request.continue();
            } else {
              this.logger.warn(`Blocked request to ${request.url()}`);
              void request.abort();
            }
          } catch {
            this.logger.warn(`Error validating request to ${request.url()}`);
            void request.abort();
          }
        })();
      });

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
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to scrape ${url}`, (error as Error).stack);
      throw new Error(`Scraping failed: ${(error as Error).message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
