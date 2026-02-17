import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { lookup } from 'dns/promises';
import { URL } from 'url';

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
    } catch (e) {
      throw new BadRequestException('Invalid URL format');
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new BadRequestException('Only HTTP/HTTPS protocols are allowed');
    }

    let address: string;
    try {
      const result = await lookup(parsedUrl.hostname);
      address = result.address;
    } catch (e) {
      throw new BadRequestException(`Could not resolve hostname: ${parsedUrl.hostname}`);
    }

    if (this.isPrivateIp(address)) {
      throw new BadRequestException('Access to private network is restricted');
    }
  }

  private isPrivateIp(ip: string): boolean {
    // Handle IPv4-mapped IPv6 addresses (e.g., ::ffff:127.0.0.1)
    if (ip.startsWith('::ffff:')) {
      const ipv4 = ip.substring(7);
      return this.isPrivateIp(ipv4);
    }

    const parts = ip.split('.');
    if (parts.length === 4) {
      const [a, b, c, d] = parts.map(Number);
      if (a === 127) return true; // 127.0.0.0/8
      if (a === 10) return true; // 10.0.0.0/8
      if (a === 192 && b === 168) return true; // 192.168.0.0/16
      if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
      if (a === 169 && b === 254) return true; // 169.254.0.0/16
      if (a === 0 && b === 0 && c === 0 && d === 0) return true; // 0.0.0.0
    } else if (ip.includes(':')) {
      if (ip === '::1') return true;
      if (ip.toLowerCase().startsWith('fc') || ip.toLowerCase().startsWith('fd')) return true;
      if (ip.toLowerCase().startsWith('fe80')) return true;
    }
    return false;
  }
}
