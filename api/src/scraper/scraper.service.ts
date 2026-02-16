import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import * as dns from 'dns/promises';
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
        headless: true, // Run in headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some environments
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const page = await browser.newPage();

      // Navigate to the URL
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Extract data
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`Failed to scrape ${url}`, error.stack);
      // Re-throw if it's already a BadRequestException from validation
      if (error instanceof BadRequestException) {
        throw error;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Scraping failed: ${error.message}`);
    } finally {
      if (browser) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        await browser.close();
      }
    }
  }

  private async validateUrl(inputUrl: string): Promise<void> {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(inputUrl);
    } catch {
      throw new BadRequestException('Invalid URL format');
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new BadRequestException(
        'Invalid protocol. Only http and https are allowed.',
      );
    }

    // Resolve hostname
    let address: string;
    try {
      const result = await dns.lookup(parsedUrl.hostname);
      address = result.address;
    } catch {
      throw new BadRequestException(
        `Could not resolve hostname: ${parsedUrl.hostname}`,
      );
    }

    // Check for private IPs
    if (this.isPrivateIp(address)) {
      throw new BadRequestException(
        'Access to private network addresses is restricted.',
      );
    }
  }

  private isPrivateIp(ip: string): boolean {
    const parts = ip.split('.').map(Number);
    if (parts.length === 4) {
      // IPv4
      // 127.0.0.0/8
      if (parts[0] === 127) return true;
      // 10.0.0.0/8
      if (parts[0] === 10) return true;
      // 172.16.0.0/12
      if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
      // 192.168.0.0/16
      if (parts[0] === 192 && parts[1] === 168) return true;
      // 169.254.0.0/16 (Link-local)
      if (parts[0] === 169 && parts[1] === 254) return true;
      // 0.0.0.0/8
      if (parts[0] === 0) return true;
    } else if (ip.includes(':')) {
      // IPv6
      // Loopback ::1
      if (ip === '::1') return true;
      // Link-local fe80::/10
      if (ip.toLowerCase().startsWith('fe80:')) return true;
      // Unique Local fc00::/7
      if (
        ip.toLowerCase().startsWith('fc') ||
        ip.toLowerCase().startsWith('fd')
      )
        return true;
      // IPv4-mapped IPv6 ::ffff:127.0.0.1
      if (ip.toLowerCase().startsWith('::ffff:')) {
        const lastPart = ip.split(':').pop();
        if (lastPart && this.isPrivateIp(lastPart)) return true;
      }
    }
    return false;
  }
}
