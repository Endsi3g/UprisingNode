import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';
import * as dns from 'dns/promises';
import { ScrapedData } from './scraped-data.interface';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  async scrapeCompany(url: string): Promise<ScrapedData> {
    await this.validateUrl(url);

    this.logger.log(`Scraping URL: ${url}`);

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
      const data = await page.evaluate((): ScrapedData => {
        const title = document.title;
        const description =
          document
            .querySelector('meta[name="description"]')
            ?.getAttribute('content') || '';
        const headings = Array.from(document.querySelectorAll('h1, h2'))
          .map((h) => h.textContent?.trim() || '')
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

  private async validateUrl(inputUrl: string): Promise<void> {
    try {
      const url = new URL(inputUrl);
      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new BadRequestException(
          'Invalid protocol. Only HTTP/HTTPS allowed.',
        );
      }

      const { address } = await dns.lookup(url.hostname);

      if (this.isPrivateIp(address)) {
        throw new BadRequestException(
          'Access to private network denied (SSRF Protection).',
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      const err = error as Error;
      // If URL parsing fails or DNS lookup fails
      throw new BadRequestException(`Invalid URL or hostname: ${err.message}`);
    }
  }

  private isPrivateIp(ip: string): boolean {
    // Check for IPv6 localhost
    if (ip === '::1') return true;

    // Check for Link-local IPv6
    if (ip.startsWith('fe80:')) return true;

    // Check for Unique Local Address (ULA) IPv6
    if (ip.startsWith('fc') || ip.startsWith('fd')) return true;

    // Check for IPv4 mapped IPv6
    if (ip.includes(':')) {
      if (ip.startsWith('::ffff:')) {
        ip = ip.substring(7);
      } else {
        // Other IPv6 addresses assumed public if not caught above
        return false;
      }
    }

    const parts = ip.split('.').map((part) => parseInt(part, 10));
    if (parts.length !== 4) return false; // Not a standard IPv4 address

    // 127.0.0.0/8
    if (parts[0] === 127) return true;

    // 10.0.0.0/8
    if (parts[0] === 10) return true;

    // 192.168.0.0/16
    if (parts[0] === 192 && parts[1] === 168) return true;

    // 172.16.0.0/12
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;

    // 169.254.0.0/16 (Link-local)
    if (parts[0] === 169 && parts[1] === 254) return true;

    return false;
  }
}
