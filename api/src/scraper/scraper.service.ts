import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';
import * as dns from 'dns';
import { promisify } from 'util';

const dnsLookup = promisify(dns.lookup);

export interface ScrapedData {
  title: string;
  description: string;
  headings: string[];
}

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  private isPrivateIP(ip: string): boolean {
    // Basic regex for private IPv4 addresses and 0.0.0.0 block
    return (
      /^(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.|127\.|169\.254\.|0\.)/.test(
        ip,
      ) ||
      ip === '::1' || // IPv6 localhost
      ip.toLowerCase().startsWith('fc') || // IPv6 Unique Local Address
      ip.toLowerCase().startsWith('fd')
    );
  }

  private async validateUrl(targetUrl: string): Promise<void> {
    try {
      const parsedUrl = new URL(targetUrl);

      // 1. Protocol Validation
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        throw new BadRequestException(
          'Invalid protocol. Only HTTP and HTTPS are allowed.',
        );
      }

      // 2. DNS Resolution and IP Validation
      const hostname = parsedUrl.hostname;
      const lookupResult = await dnsLookup(hostname);

      if (this.isPrivateIP(lookupResult.address)) {
        throw new BadRequestException(
          'Access to private or local IP addresses is forbidden.',
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      // Fail closed on DNS errors or invalid URLs

      const e = error as Error;
      throw new BadRequestException(
        `Invalid URL or unable to resolve hostname: ${e.message ?? 'Unknown error'}`,
      );
    }
  }

  async scrapeCompany(url: string): Promise<ScrapedData> {
    this.logger.log(`Scraping URL: ${url}`);
    await this.validateUrl(url);

    let browser: Browser | undefined;
    try {
      browser = (await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })) as unknown as Browser;

      const page: Page = await browser.newPage();

      // Enable request interception to validate all requests (including redirects and subresources)
      await page.setRequestInterception(true);
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      page.on('request', async (request) => {
        try {
          await this.validateUrl(request.url());
          void request.continue();
        } catch (error) {
          const e = error as Error;
          this.logger.warn(
            `Blocked request to ${request.url()}: ${e.message ?? 'Unknown error'}`,
          );
          void request.abort();
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
      const e = error as Error;
      this.logger.error(`Failed to scrape ${url}`, e.stack ?? 'Unknown stack');
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new Error(`Scraping failed: ${e.message ?? 'Unknown error'}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
