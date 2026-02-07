import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { lookup } from 'dns/promises';
import { URL } from 'url';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  async scrapeCompany(url: string): Promise<any> {
    this.logger.log(`Scraping URL: ${url}`);

    await this.validateUrl(url);

    let browser;
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
    } catch (error: any) {
      this.logger.error(`Failed to scrape ${url}`, error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Scraping failed: ${error.message}`);
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
        throw new BadRequestException('Access to localhost is forbidden.');
      }

      const { address } = await lookup(parsedUrl.hostname);

      if (this.isPrivateIp(address)) {
        throw new BadRequestException(
          'Access to private network addresses is forbidden.',
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(`Invalid URL: ${error.message}`);
    }
  }

  private isPrivateIp(ip: string): boolean {
    // Handle IPv4-mapped IPv6
    if (ip.startsWith('::ffff:')) {
      ip = ip.substring(7);
    }

    // IPv4 check
    if (ip.includes('.')) {
      const parts = ip.split('.').map(Number);
      if (parts.length === 4 && parts.every((n) => !isNaN(n))) {
        // 10.0.0.0/8
        if (parts[0] === 10) return true;
        // 172.16.0.0/12
        if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
        // 192.168.0.0/16
        if (parts[0] === 192 && parts[1] === 168) return true;
        // 127.0.0.0/8 (Loopback)
        if (parts[0] === 127) return true;
        // 169.254.0.0/16 (Link-local)
        if (parts[0] === 169 && parts[1] === 254) return true;
        return false;
      }
    }

    // IPv6 check
    // ::1 (Loopback)
    if (ip === '::1') return true;
    // fe80::/10 (Link-local)
    if (ip.toLowerCase().startsWith('fe80:')) return true;
    // fc00::/7 (Unique Local)
    if (ip.toLowerCase().startsWith('fc') || ip.toLowerCase().startsWith('fd'))
      return true;

    return false;
  }
}
