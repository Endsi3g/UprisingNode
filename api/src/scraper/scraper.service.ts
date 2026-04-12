import { Injectable, Logger } from '@nestjs/common';
import puppeteer from 'puppeteer';
import type { Browser, HTTPRequest } from 'puppeteer';
import * as dns from 'dns/promises';
import * as net from 'net';

export interface ScrapedData {
  title: string;
  description: string;
  headings: string[];
}

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  private async isSafeUrl(urlStr: string): Promise<boolean> {
    try {
      const parsedUrl = new URL(urlStr);

      // Only allow http and https protocols
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return false;
      }

      // Resolve the hostname to an IP address
      const lookup = await dns.lookup(parsedUrl.hostname);
      const ip = lookup.address;

      // Check for IPv4 SSRF targets
      if (net.isIPv4(ip)) {
        // Block 0.0.0.0/8
        if (ip.startsWith('0.')) return false;
        // Block 127.0.0.0/8 (Loopback)
        if (ip.startsWith('127.')) return false;
        // Block 10.0.0.0/8 (Private)
        if (ip.startsWith('10.')) return false;
        // Block 172.16.0.0/12 (Private)
        const parts = ip.split('.').map(Number);
        if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return false;
        // Block 192.168.0.0/16 (Private)
        if (ip.startsWith('192.168.')) return false;
        // Block 169.254.0.0/16 (Link-local/Cloud metadata)
        if (ip.startsWith('169.254.')) return false;
      }

      // Check for IPv6 SSRF targets
      if (net.isIPv6(ip)) {
        const normalizedIp = ip.toLowerCase();
        // Block loopback
        if (normalizedIp === '::1') return false;
        // Block IPv4-mapped IPv6 loopback and private addresses
        if (normalizedIp.includes('::ffff:')) {
          const ipv4Part = normalizedIp.split('::ffff:')[1];
          if (ipv4Part.startsWith('0.')) return false;
          if (ipv4Part.startsWith('127.')) return false;
          if (ipv4Part.startsWith('10.')) return false;
          const parts = ipv4Part.split('.').map(Number);
          if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) {
            return false;
          }
          if (ipv4Part.startsWith('192.168.')) return false;
          if (ipv4Part.startsWith('169.254.')) return false;
        }
      }

      return true;
    } catch {
      // If URL parsing or DNS resolution fails, block it
      return false;
    }
  }

  async scrapeCompany(url: string): Promise<ScrapedData> {
    this.logger.log(`Scraping URL: ${url}`);

    let browser: Browser | undefined;
    try {
      browser = await puppeteer.launch({
        headless: true, // Run in headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some environments
      });

      const page = await browser.newPage();

      // Enable request interception
      await page.setRequestInterception(true);

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      page.on('request', async (request: HTTPRequest) => {
        const requestUrl = request.url();
        const isSafe = await this.isSafeUrl(requestUrl);

        if (!isSafe) {
          this.logger.warn(`Blocked unsafe request: ${requestUrl}`);
          await request.abort('accessdenied');
        } else {
          await request.continue();
        }
      });

      // Validate the initial URL
      if (!(await this.isSafeUrl(url))) {
        throw new Error('Unsafe URL provided');
      }

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
    } catch (error: unknown) {
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
