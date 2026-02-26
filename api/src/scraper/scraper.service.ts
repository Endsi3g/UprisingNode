import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer, { HTTPRequest } from 'puppeteer';
import { URL } from 'url';
import * as dns from 'dns/promises';

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

      // Enable request interception to validate all URLs (including redirects and resources)
      await page.setRequestInterception(true);

      page.on('request', async (request: HTTPRequest) => {
        const requestUrl = request.url();
        try {
          await this.validateUrl(requestUrl);
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          request.continue();
        } catch (error) {
          this.logger.warn(`Blocked request to ${requestUrl}: ${error.message}`);
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          request.abort('accessdenied');
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
      this.logger.error(`Failed to scrape ${url}`, error.stack);
      throw new Error(`Scraping failed: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  private async validateUrl(urlString: string): Promise<void> {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(urlString);
    } catch (error) {
      throw new BadRequestException('Invalid URL format');
    }

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new BadRequestException(
        'Invalid protocol. Only HTTP and HTTPS are allowed.',
      );
    }

    let hostname = parsedUrl.hostname;

    // Remove square brackets from IPv6 addresses for DNS lookup
    if (hostname.startsWith('[') && hostname.endsWith(']')) {
      hostname = hostname.slice(1, -1);
    }

    try {
      const { address, family } = await dns.lookup(hostname);
      if (this.isPrivateIp(address, family)) {
        throw new BadRequestException('Restricted access to private network.');
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      // Fail closed: if DNS lookup fails, do not proceed
      throw new BadRequestException('Could not resolve hostname');
    }
  }

  private isPrivateIp(ip: string, family: number = 4): boolean {
    if (family === 4) {
      const parts = ip.split('.');
      const first = parseInt(parts[0], 10);
      const second = parseInt(parts[1], 10);

      // 0.0.0.0/8
      if (first === 0) return true;
      // 10.0.0.0/8
      if (first === 10) return true;
      // 127.0.0.0/8
      if (first === 127) return true;
      // 169.254.0.0/16
      if (first === 169 && second === 254) return true;
      // 172.16.0.0/12
      if (first === 172 && second >= 16 && second <= 31) return true;
      // 192.168.0.0/16
      if (first === 192 && second === 168) return true;

      return false;
    } else if (family === 6) {
      // ::1
      if (ip === '::1') return true;
      // fc00::/7
      if (
        ip.toLowerCase().startsWith('fc') ||
        ip.toLowerCase().startsWith('fd')
      )
        return true;
      // fe80::/10
      if (ip.toLowerCase().startsWith('fe80')) return true;

      if (ip.toLowerCase().startsWith('::ffff:')) {
        return this.isPrivateIp(ip.substring(7), 4);
      }

      return false;
    }
    return false;
  }
}
