import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';
import * as dns from 'dns/promises';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  async scrapeCompany(url: string): Promise<any> {
    this.logger.log(`Scraping URL: ${url}`);

    await this.validateUrl(url);

    let browser: Browser | undefined;
    try {
      browser = await puppeteer.launch({
        headless: true, // Run in headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some environments
      });

      const page: Page = await browser.newPage();

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
      const err = error as Error;
      this.logger.error(`Failed to scrape ${url}`, err.stack);
      throw new Error(`Scraping failed: ${err.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  private async validateUrl(url: string): Promise<void> {
    try {
      const parsedUrl = new URL(url);

      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new BadRequestException(
          'Invalid protocol. Only http and https are allowed.',
        );
      }

      if (
        parsedUrl.hostname === 'localhost' ||
        parsedUrl.hostname === '127.0.0.1' ||
        parsedUrl.hostname === '[::1]'
      ) {
        throw new BadRequestException('Access to localhost is denied.');
      }

      // Resolve hostname to IP to check for private ranges
      const { address } = await dns.lookup(parsedUrl.hostname);
      if (this.isPrivateIp(address)) {
        throw new BadRequestException('Access to private IP ranges is denied.');
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Invalid URL provided.');
    }
  }

  private isPrivateIp(ip: string): boolean {
    // IPv4 check
    const parts = ip.split('.').map(Number);
    if (parts.length === 4) {
      // 0.0.0.0/8 (Current network)
      if (parts[0] === 0) return true;
      // 10.0.0.0/8 (Private network)
      if (parts[0] === 10) return true;
      // 172.16.0.0/12 (Private network)
      if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
      // 192.168.0.0/16 (Private network)
      if (parts[0] === 192 && parts[1] === 168) return true;
      // 127.0.0.0/8 (Loopback)
      if (parts[0] === 127) return true;
      // 169.254.0.0/16 (Link-local)
      if (parts[0] === 169 && parts[1] === 254) return true;
    }

    // IPv6 check (basic check for loopback and link-local)
    // ::1 is loopback
    if (ip === '::1') return true;
    // fe80::/10 is link-local
    if (ip.toLowerCase().startsWith('fe80:')) return true;

    // IPv4-mapped IPv6 addresses (::ffff:127.0.0.1)
    if (ip.toLowerCase().startsWith('::ffff:')) {
      return this.isPrivateIp(ip.substring(7));
    }

    return false;
  }
}
