import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';
import { lookup } from 'dns/promises';

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
      this.logger.error(`Failed to scrape ${url}`, (error as Error).stack);
      throw new Error(`Scraping failed: ${(error as Error).message}`);
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

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new BadRequestException(
        'Only HTTP and HTTPS protocols are allowed',
      );
    }

    if (
      parsedUrl.hostname === 'localhost' ||
      parsedUrl.hostname.includes('127.0.0.1') ||
      parsedUrl.hostname === '::1'
    ) {
      throw new BadRequestException('Access to localhost is forbidden');
    }

    try {
      const addresses = await lookup(parsedUrl.hostname, { all: true });
      for (const { address } of addresses) {
        if (this.isPrivateIp(address)) {
          throw new BadRequestException(
            `Access to private IP ${address} is forbidden`,
          );
        }
      }
    } catch (e) {
      if (e instanceof BadRequestException) throw e;
      throw new BadRequestException(
        `Could not resolve hostname: ${parsedUrl.hostname}`,
      );
    }
  }

  private isPrivateIp(ip: string): boolean {
    if (ip.includes(':')) return true; // Block IPv6 for now to be safe
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4) return false;

    // 127.0.0.0/8
    if (parts[0] === 127) return true;
    // 10.0.0.0/8
    if (parts[0] === 10) return true;
    // 172.16.0.0/12
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    // 192.168.0.0/16
    if (parts[0] === 192 && parts[1] === 168) return true;
    // 169.254.0.0/16
    if (parts[0] === 169 && parts[1] === 254) return true;
    // 0.0.0.0/8
    if (parts[0] === 0) return true;

    return false;
  }
}
