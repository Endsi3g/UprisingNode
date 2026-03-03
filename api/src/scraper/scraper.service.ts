import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';
import * as dns from 'dns';
import { promisify } from 'util';
import * as ipaddr from 'ipaddr.js';

const lookupAsync = promisify(dns.lookup);

export interface ScrapedData {
  title: string;
  description: string;
  headings: string[];
}

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  private isInternalIp(ip: string): boolean {
    try {
      const parsedIp = ipaddr.parse(ip);
      const range = parsedIp.range();

      // Allow only valid public unicast IP addresses.
      // `ipaddr.js` returns 'unicast' for public IPs.
      return range !== 'unicast';
    } catch {
      // If the IP is invalid, assume it is not safe.
      return true;
    }
  }

  private async isSafeUrl(targetUrl: string): Promise<boolean> {
    try {
      const parsedUrl = new URL(targetUrl);
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return false;
      }

      // Resolve DNS to IP and check if internal
      const { address } = await lookupAsync(parsedUrl.hostname);
      if (this.isInternalIp(address)) {
        return false;
      }

      return true;
    } catch {
      return false; // Invalid URL or DNS resolution failed
    }
  }

  async scrapeCompany(url: string): Promise<ScrapedData> {
    this.logger.log(`Scraping URL: ${url}`);

    // Initial URL validation before launching browser
    if (!(await this.isSafeUrl(url))) {
      throw new BadRequestException('Invalid or blocked URL');
    }

    let browser: Browser | undefined;
    try {
      browser = await puppeteer.launch({
        headless: true, // Run in headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some environments
      });

      const page = await browser.newPage();

      // Enable request interception to validate all network requests and redirects
      await page.setRequestInterception(true);
      page.on('request', (request) => {
        void (async () => {
          try {
            if (request.isInterceptResolutionHandled()) return;
            const requestUrl = request.url();
            if (await this.isSafeUrl(requestUrl)) {
              await request.continue();
            } else {
              this.logger.warn(
                `Blocked request to potentially unsafe URL: ${requestUrl}`,
              );
              await request.abort('accessdenied');
            }
          } catch (e) {
            this.logger.error(
              'Error in request interception',
              (e as Error).stack,
            );
            if (!request.isInterceptResolutionHandled()) {
              try {
                await request.abort('failed');
              } catch {
                // Ignore errors if the request is already aborted or the browser is closed
              }
            }
          }
        })().catch((err) => {
          this.logger.error(
            'Unhandled error in request interceptor',
            (err as Error).stack,
          );
        });
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
      if (e instanceof BadRequestException) {
        throw e;
      }
      this.logger.error(`Failed to scrape ${url}`, e.stack);
      throw new Error(`Scraping failed: ${e.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
