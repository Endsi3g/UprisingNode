/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
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

  private async validateUrl(inputUrl: string): Promise<void> {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(inputUrl);
    } catch {
      throw new BadRequestException('Invalid URL format');
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new BadRequestException('Only HTTP/HTTPS protocols are allowed');
    }

    const hostname = parsedUrl.hostname;

    // Remove brackets from IPv6 literals for validation (e.g., [::1] -> ::1)
    const normalizedHostname =
      hostname.startsWith('[') && hostname.endsWith(']')
        ? hostname.slice(1, -1)
        : hostname;

    // Check for localhost explicitly (optional optimization, but good for clarity)
    if (['localhost', '127.0.0.1', '::1'].includes(normalizedHostname)) {
      throw new BadRequestException('Access to private network is restricted');
    }

    try {
      // Resolve hostname to IP
      const { address } = await lookup(normalizedHostname);
      if (this.isPrivateIp(address)) {
        throw new BadRequestException(
          'Access to private network is restricted',
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      // If lookup fails, we assume it's unresolvable or invalid, so we block it.
      throw new BadRequestException(
        `Could not resolve hostname: ${normalizedHostname}`,
      );
    }
  }

  private isPrivateIp(ip: string): boolean {
    // IPv6 checks
    if (ip === '::1') return true;
    if (ip.startsWith('fe80:')) return true; // Link-local
    if (ip.startsWith('fc') || ip.startsWith('fd')) return true; // Unique local
    // IPv4 mapped IPv6
    if (ip.startsWith('::ffff:')) {
      const ipv4Part = ip.split(':').pop();
      if (ipv4Part) return this.isPrivateIp(ipv4Part);
    }

    // IPv4 checks
    const parts = ip.split('.').map(Number);
    if (parts.length === 4) {
      if (parts[0] === 10) return true; // 10.0.0.0/8
      if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true; // 172.16.0.0/12
      if (parts[0] === 192 && parts[1] === 168) return true; // 192.168.0.0/16
      if (parts[0] === 127) return true; // 127.0.0.0/8
      if (parts[0] === 169 && parts[1] === 254) return true; // 169.254.0.0/16 (Link-local)
    }

    return false;
  }
}
