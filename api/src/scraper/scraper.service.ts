import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import type { Browser } from 'puppeteer';
import { lookup } from 'dns/promises';
import { URL } from 'url';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  async scrapeCompany(url: string): Promise<any> {
    await this.validateUrl(url);

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
      /* eslint-disable @typescript-eslint/no-unsafe-member-access */
      this.logger.error(`Failed to scrape ${url}`, error.stack);
      throw new Error(`Scraping failed: ${error.message}`);
      /* eslint-enable */
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  async validateUrl(url: string): Promise<void> {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      throw new BadRequestException('Invalid URL format');
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new BadRequestException('Invalid protocol (http/https only)');
    }

    try {
      const { address } = await lookup(parsedUrl.hostname);
      if (this.isPrivateIp(address)) {
        throw new BadRequestException(
          'Access to private/internal network is forbidden',
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Could not resolve host: ${parsedUrl.hostname}`,
      );
    }
  }

  private isPrivateIp(ip: string): boolean {
    if (ip === '::1') return true; // Localhost IPv6
    if (ip.includes(':')) {
      // IPv6 - Simplified check for private ranges
      // Unique Local (fc00::/7) -> fc or fd
      const firstGroup = ip.split(':')[0].toLowerCase();
      if (
        firstGroup.startsWith('fc') ||
        firstGroup.startsWith('fd') ||
        firstGroup.startsWith('fe80')
      ) {
        return true;
      }
      // IPv4 mapped
      if (ip.toLowerCase().includes('::ffff:')) {
        return this.isPrivateIp(ip.split(':').pop()!);
      }
      return false;
    }

    // IPv4
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4) return false;

    // 0.0.0.0/8
    if (parts[0] === 0) return true;
    // 10.0.0.0/8
    if (parts[0] === 10) return true;
    // 127.0.0.0/8
    if (parts[0] === 127) return true;
    // 169.254.0.0/16
    if (parts[0] === 169 && parts[1] === 254) return true;
    // 172.16.0.0/12 (172.16.0.0 - 172.31.255.255)
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    // 192.168.0.0/16
    if (parts[0] === 192 && parts[1] === 168) return true;

    return false;
  }
}
