import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import * as dns from 'dns/promises';
import { URL } from 'url';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  async scrapeCompany(url: string): Promise<any> {
    this.logger.log(`Scraping URL: ${url}`);

    // Validate the URL before proceeding
    await this.validateUrl(url);

    let browser;
    try {
      /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
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
      /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

      this.logger.log(`Successfully scraped data for ${url}`);
      return data;
    } catch (error) {
        if (error instanceof BadRequestException) {
            throw error;
        }
      const stack = error instanceof Error ? error.stack : '';
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to scrape ${url}`, stack);
      throw new Error(`Scraping failed: ${message}`);
    } finally {
      if (browser) {
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
        await browser.close();
      }
    }
  }

  private async validateUrl(urlString: string): Promise<void> {
    let url: URL;
    try {
      url = new URL(urlString);
    } catch (_err) {
      throw new BadRequestException('Invalid URL format');
    }

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new BadRequestException('Invalid protocol. Only http and https are allowed.');
    }

    let ip: string;
    try {
      // Remove brackets for IPv6 addresses if present (e.g., [::1] -> ::1)
      const hostname = url.hostname.startsWith('[') && url.hostname.endsWith(']')
        ? url.hostname.slice(1, -1)
        : url.hostname;

      const result = await dns.lookup(hostname);
      ip = result.address;
    } catch (_err) {
      throw new BadRequestException(`Could not resolve hostname: ${url.hostname}`);
    }

    if (this.isPrivateIp(ip)) {
      throw new BadRequestException(`Access to private IP ${ip} is forbidden.`);
    }
  }

  private isPrivateIp(ip: string): boolean {
    const parts = ip.split('.').map(Number);
    if (parts.length === 4) {
        // IPv4
        // 127.0.0.0/8 (Loopback)
        if (parts[0] === 127) return true;
        // 10.0.0.0/8 (Private)
        if (parts[0] === 10) return true;
        // 172.16.0.0/12 (Private)
        if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
        // 192.168.0.0/16 (Private)
        if (parts[0] === 192 && parts[1] === 168) return true;
        // 169.254.0.0/16 (Link-Local)
        if (parts[0] === 169 && parts[1] === 254) return true;
        // 0.0.0.0/8 (Current network)
        if (parts[0] === 0) return true;
         // 255.255.255.255 (Broadcast)
        if (ip === '255.255.255.255') return true;

        return false;
    } else if (ip.includes(':')) {
        // IPv6
        // ::1 (Loopback)
        if (ip === '::1') return true;
        // fc00::/7 (Unique Local Address)
        if (ip.toLowerCase().startsWith('fc') || ip.toLowerCase().startsWith('fd')) return true;
        // fe80::/10 (Link-Local Unicast)
        if (ip.toLowerCase().startsWith('fe80')) return true;
        // ::ffff:0:0/96 (IPv4-mapped IPv6) - check mapped IPv4 part if needed, but blocking map addresses is safer
        if (ip.toLowerCase().startsWith('::ffff:')) return true;

        return false;
    }
    return false; // Should not happen if dns.lookup returns a valid IP
  }
}
