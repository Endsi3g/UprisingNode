import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer, { Browser, Page, HTTPRequest } from 'puppeteer';
import * as dns from 'dns/promises';
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

      const page: Page = await browser.newPage();

      // Block requests to private IPs
      await page.setRequestInterception(true);

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      page.on('request', async (request: HTTPRequest) => {
        try {
          const reqUrl = request.url();
          if (reqUrl.startsWith('data:')) {
            await request.continue();
            return;
          }

          const parsedUrl = new URL(reqUrl);
          if (
            parsedUrl.protocol !== 'http:' &&
            parsedUrl.protocol !== 'https:'
          ) {
            await request.abort();
            return;
          }

          const { address } = await dns.lookup(parsedUrl.hostname);
          if (this.isPrivateIp(address)) {
            this.logger.warn(`Blocked request to private IP: ${reqUrl}`);
            await request.abort();
          } else {
            await request.continue();
          }
        } catch {
          await request.abort();
        }
      });

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
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(`Failed to scrape ${url}`, err.stack);
      throw new Error(`Scraping failed: ${err.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  private async validateUrl(inputUrl: string): Promise<string> {
    let url: URL;
    try {
      url = new URL(inputUrl);
    } catch {
      throw new BadRequestException('Invalid URL format');
    }

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new BadRequestException(
        'Only HTTP and HTTPS protocols are allowed',
      );
    }

    // Resolve hostname to IP
    try {
      const { address } = await dns.lookup(url.hostname);
      if (this.isPrivateIp(address)) {
        throw new BadRequestException(
          'Access to private network resources is forbidden',
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Could not resolve hostname');
    }

    return inputUrl;
  }

  private isPrivateIp(ip: string): boolean {
    // Handle IPv4-mapped IPv6 addresses
    if (ip.startsWith('::ffff:')) {
      ip = ip.substring(7);
    }

    // IPv4 check
    const parts = ip.split('.').map(Number);
    if (parts.length === 4) {
      if (parts[0] === 10) return true;
      if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
      if (parts[0] === 192 && parts[1] === 168) return true;
      if (parts[0] === 127) return true;
      if (parts[0] === 0) return true;
      if (parts[0] === 169 && parts[1] === 254) return true;
      return false;
    }

    // IPv6 check
    if (ip === '::1') return true;
    if (ip.toLowerCase().startsWith('fc') || ip.toLowerCase().startsWith('fd'))
      return true;
    if (ip.toLowerCase().startsWith('fe80')) return true;

    return false;
  }
}
