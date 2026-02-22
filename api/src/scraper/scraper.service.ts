import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer, { Browser, HTTPRequest } from 'puppeteer';
import { URL } from 'url';
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

      // Enable request interception to validate all requests (including redirects)
      await page.setRequestInterception(true);

      /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
      page.on('request', async (request: HTTPRequest) => {
        const reqUrl = request.url();
        try {
          // Validate every request URL
          await this.validateUrl(reqUrl);
          await request.continue();
        } catch (error: any) {
          /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
          this.logger.warn(`Blocked request to ${reqUrl}: ${error.message}`);
          await request.abort('accessdenied');
        }
      });

      // Navigate to the URL
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Extract data
      const data: any = await page.evaluate(() => {
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
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
      this.logger.error(`Failed to scrape ${url}`, error.stack);
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
      throw new Error(`Scraping failed: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  private async validateUrl(urlString: string): Promise<void> {
    let url: URL;
    try {
      url = new URL(urlString);
    } catch {
      throw new BadRequestException('Invalid URL format');
    }

    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new BadRequestException(
        'Invalid protocol. Only http and https are allowed',
      );
    }

    try {
      const { address } = await lookup(url.hostname);

      if (this.isPrivateIp(address)) {
        throw new BadRequestException(
          'Access to private network resources is denied',
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      // If DNS lookup fails, treat as invalid
      throw new BadRequestException(
        `Could not resolve hostname: ${url.hostname}`,
      );
    }
  }

  private isPrivateIp(ip: string): boolean {
    // IPv6 Loopback
    if (ip === '::1') return true;
    // IPv6 Link-local
    if (ip.startsWith('fe80:')) return true;
    // IPv6 Unique Local
    if (ip.startsWith('fc') || ip.startsWith('fd')) return true;

    // IPv4
    const parts = ip.split('.').map(Number);
    if (parts.length === 4) {
      // 10.0.0.0/8
      if (parts[0] === 10) return true;
      // 172.16.0.0/12
      if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
      // 192.168.0.0/16
      if (parts[0] === 192 && parts[1] === 168) return true;
      // 127.0.0.0/8
      if (parts[0] === 127) return true;
      // 169.254.0.0/16 (Link-local / Cloud metadata)
      if (parts[0] === 169 && parts[1] === 254) return true;
      // 0.0.0.0/8
      if (parts[0] === 0) return true;
    }

    return false;
  }
}
