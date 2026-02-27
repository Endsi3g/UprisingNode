import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer, { Browser, Page, HTTPRequest } from 'puppeteer';
import * as dns from 'dns';
import { URL } from 'url';

interface ScrapedData {
  title: string;
  description: string;
  headings: string[];
}

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  async scrapeCompany(url: string): Promise<ScrapedData> {
    this.logger.log(`Scraping URL: ${url}`);

    await this.validateUrl(url);

    let browser: Browser | undefined;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page: Page = await browser.newPage();

      // Enable request interception to prevent SSRF on redirects and subresources
      await page.setRequestInterception(true);

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      page.on('request', async (request: HTTPRequest) => {
        try {
          if (request.isNavigationRequest()) {
            await this.validateUrl(request.url());
          }
          await request.continue();
        } catch (error: unknown) {
          this.logger.warn(
            `Blocked request to ${request.url()}: ${(error as Error).message}`,
          );
          await request.abort('accessdenied');
        }
      });

      // Navigate to the URL
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Extract data
      const data: ScrapedData = await page.evaluate(() => {
        const title = document.title;
        const description =
          document
            .querySelector('meta[name="description"]')
            ?.getAttribute('content') || '';
        const headings = Array.from(document.querySelectorAll('h1, h2'))
          .map((h) => h.textContent?.trim())
          .filter((h): h is string => !!h);

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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`Failed to scrape ${url}`, error.stack);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
    } catch {
      throw new BadRequestException('Invalid URL format');
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new BadRequestException(
        'Only HTTP and HTTPS protocols are allowed',
      );
    }

    const hostname = parsedUrl.hostname;

    // Check for obvious localhost/private variants in hostname string before DNS lookup
    if (
      hostname === 'localhost' ||
      hostname === '[::1]' ||
      hostname.startsWith('127.') ||
      hostname === '::1'
    ) {
      throw new BadRequestException(
        'Access to local/private network is restricted',
      );
    }

    try {
      // Clean brackets from IPv6 for lookup
      const lookupHostname = hostname.replace(/^\[|\]$/g, '');
      const { address } = await dns.promises.lookup(lookupHostname);

      if (this.isPrivateIp(address)) {
        throw new BadRequestException(
          'Access to local/private network is restricted',
        );
      }
    } catch (error) {
      // Re-throw BadRequestException, wrap others
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(`Could not resolve hostname: ${hostname}`);
    }
  }

  private isPrivateIp(ip: string): boolean {
    const parts = ip.split('.').map(Number);

    // IPv4 checks
    if (parts.length === 4) {
      // 10.0.0.0/8
      if (parts[0] === 10) return true;
      // 172.16.0.0/12
      if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
      // 192.168.0.0/16
      if (parts[0] === 192 && parts[1] === 168) return true;
      // 127.0.0.0/8 (Loopback)
      if (parts[0] === 127) return true;
      // 169.254.0.0/16 (Link-local)
      if (parts[0] === 169 && parts[1] === 254) return true;
    }

    // IPv6 checks
    if (ip === '::1' || ip === '0:0:0:0:0:0:0:1') return true; // Loopback
    if (ip.toLowerCase().startsWith('fc') || ip.toLowerCase().startsWith('fd'))
      return true; // Unique Local Address
    if (ip.toLowerCase().startsWith('fe80')) return true; // Link-local

    return false;
  }
}
