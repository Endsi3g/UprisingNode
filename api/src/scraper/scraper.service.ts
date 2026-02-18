/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import * as dns from 'node:dns/promises';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  async scrapeCompany(url: string): Promise<any> {
    await this.validateUrl(url);

    this.logger.log(`Scraping URL: ${url}`);

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
    } catch (error) {
      // Re-throw BadRequestException to allow it to bubble up
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to scrape ${url}`, error.stack);
      throw new Error(`Scraping failed: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  private async validateUrl(url: string): Promise<void> {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      throw new BadRequestException('Invalid URL format');
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new BadRequestException(
        'Invalid protocol. Only http and https are allowed.',
      );
    }

    let address: string;
    let family: number;

    try {
      const result = await dns.lookup(parsedUrl.hostname);
      address = result.address;
      family = result.family;
    } catch {
      throw new BadRequestException(
        `Could not resolve hostname: ${parsedUrl.hostname}`,
      );
    }

    if (this.isPrivateIp(address, family)) {
      throw new BadRequestException(
        'Access to private network resources is forbidden.',
      );
    }
  }

  private isPrivateIp(ip: string, family: number): boolean {
    if (family === 4) {
      const parts = ip.split('.').map(Number);
      if (parts[0] === 10) return true; // 10.0.0.0/8
      if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true; // 172.16.0.0/12
      if (parts[0] === 192 && parts[1] === 168) return true; // 192.168.0.0/16
      if (parts[0] === 127) return true; // 127.0.0.0/8 (Loopback)
      if (parts[0] === 169 && parts[1] === 254) return true; // 169.254.0.0/16 (Link-local)
      if (parts[0] === 0) return true; // 0.0.0.0/8
    } else if (family === 6) {
      const lowerIp = ip.toLowerCase();
      if (lowerIp === '::1' || lowerIp === '0:0:0:0:0:0:0:1') return true; // Loopback
      if (lowerIp.startsWith('fc') || lowerIp.startsWith('fd')) return true; // Unique Local
      if (lowerIp.startsWith('fe80')) return true; // Link-local
      if (lowerIp.includes('::ffff:')) return true; // IPv4 mapped
    }
    return false;
  }
}
