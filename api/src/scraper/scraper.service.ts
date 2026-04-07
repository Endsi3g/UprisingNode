import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import type { Browser } from 'puppeteer';
import * as dns from 'dns/promises';

@Injectable()
export class ScraperService {
  private async isSafeUrl(urlString: string): Promise<boolean> {
    try {
      const parsedUrl = new URL(urlString);

      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return false;
      }

      const hostname = parsedUrl.hostname;
      const lookupResult = await dns.lookup(hostname);
      const ip = lookupResult.address;

      // IPv4 block checks
      if (ip.includes('.')) {
        const parts = ip.split('.').map(Number);

        // Block 0.0.0.0/8 (Current network / equivalent to localhost on some systems)
        if (parts[0] === 0) return false;

        // Block 127.0.0.0/8 (Loopback)
        if (parts[0] === 127) return false;

        // Block 10.0.0.0/8 (Private network)
        if (parts[0] === 10) return false;

        // Block 172.16.0.0/12 (Private network)
        if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return false;

        // Block 192.168.0.0/16 (Private network)
        if (parts[0] === 192 && parts[1] === 168) return false;

        // Block 169.254.0.0/16 (Link-local / AWS Metadata)
        if (parts[0] === 169 && parts[1] === 254) return false;
      }
      // IPv6 block checks
      else if (ip.includes(':')) {
        // Block loopback (::1)
        if (ip === '::1' || ip.toLowerCase() === '0:0:0:0:0:0:0:1')
          return false;

        // Basic check for Unique Local Addresses (fc00::/7)
        if (
          ip.toLowerCase().startsWith('fc') ||
          ip.toLowerCase().startsWith('fd')
        )
          return false;

        // Link-local addresses (fe80::/10)
        if (
          ip.toLowerCase().startsWith('fe8') ||
          ip.toLowerCase().startsWith('fe9') ||
          ip.toLowerCase().startsWith('fea') ||
          ip.toLowerCase().startsWith('feb')
        )
          return false;
      }

      return true;
    } catch {
      // If URL parsing or DNS lookup fails, treat it as unsafe
      return false;
    }
  }

  private readonly logger = new Logger(ScraperService.name);

  async scrapeCompany(url: string): Promise<Record<string, unknown>> {
    this.logger.log(`Scraping URL: ${url}`);

    const isSafe = await this.isSafeUrl(url);
    if (!isSafe) {
      throw new BadRequestException('Invalid or unsafe URL provided');
    }

    let browser: Browser | undefined;
    try {
      browser = await puppeteer.launch({
        headless: true, // Run in headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some environments
      });

      const page = await browser.newPage();

      // Enable request interception to catch redirects and prevent bypasses
      await page.setRequestInterception(true);
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      page.on('request', async (request) => {
        if (request.isInterceptResolutionHandled()) return;

        const reqUrl = request.url();
        // Check if subrequests/redirects are attempting to hit internal IPs.
        if (request.isNavigationRequest()) {
          const isReqSafe = await this.isSafeUrl(reqUrl);
          if (!isReqSafe) {
            this.logger.warn(
              `Blocked unsafe redirect/navigation to: ${reqUrl}`,
            );
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            request.abort('accessdenied');
            return;
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        request.continue();
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
      return data as Record<string, unknown>;
    } catch (error) {
      const e = error as Error;
      this.logger.error(`Failed to scrape ${url}`, e.stack);
      throw new Error(`Scraping failed: ${e.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
