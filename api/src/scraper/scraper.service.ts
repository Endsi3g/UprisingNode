/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { Injectable, Logger } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { lookup } from 'dns/promises';
import { URL } from 'url';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  async scrapeCompany(url: string): Promise<any> {
    this.logger.log(`Scraping URL: ${url}`);

    await this.validateUrl(url);

    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

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
      this.logger.error(`Failed to scrape ${url}`, error.stack);
      // Ensure the error message is propagated clearly
      throw new Error(error.message);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  private async validateUrl(inputUrl: string): Promise<void> {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(inputUrl);
    } catch {
      throw new Error('Invalid URL format');
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Invalid protocol: only http and https are allowed');
    }

    const { address } = await lookup(parsedUrl.hostname);

    if (this.isPrivateIp(address)) {
      throw new Error(`Access to private IP ${address} is denied`);
    }
  }

  private isPrivateIp(ip: string): boolean {
    // IPv4 checks
    if (
      ip.startsWith('127.') ||
      ip.startsWith('10.') ||
      ip.startsWith('192.168.') ||
      ip.startsWith('169.254.')
    ) {
      return true;
    }
    if (ip.startsWith('172.')) {
      const parts = ip.split('.');
      if (parts.length > 1) {
        const second = parseInt(parts[1], 10);
        if (second >= 16 && second <= 31) return true;
      }
    }

    // IPv6 checks
    if (
      ip === '::1' ||
      ip.startsWith('fc') ||
      ip.startsWith('fd') ||
      ip.startsWith('fe80')
    ) {
      return true;
    }

    return false;
  }
}
