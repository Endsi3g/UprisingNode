import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import type { Browser } from 'puppeteer';

export interface ScrapedData {
  title: string;
  description: string;
  headings: string[];
}

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  private isSafeUrl(urlString: string): boolean {
    try {
      const url = new URL(urlString);

      // Allow only http and https
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return false;
      }

      const hostname = url.hostname;

      // Regex to strictly match IPv4 and IPv6 addresses
      const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
      const ipv6Regex = /^\[?([0-9a-fA-F]{0,4}:){1,7}[0-9a-fA-F]{0,4}\]?$/;

      // Block SSRF if the hostname is exactly a restricted IP address format or localhost
      if (hostname === 'localhost') {
        return false;
      }

      if (ipv4Regex.test(hostname)) {
        if (
          hostname.startsWith('127.') || // Loopback
          hostname.startsWith('10.') || // Private
          hostname.startsWith('192.168.') || // Private
          hostname === '169.254.169.254' || // Cloud Metadata
          hostname === '0.0.0.0' ||
          /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname) // Private 172.16.0.0/12
        ) {
          return false;
        }
      }

      if (ipv6Regex.test(hostname)) {
        if (hostname.includes('::1')) {
          return false;
        }
      }

      // Note: A more robust check in a real environment would use dns.lookup
      // to resolve the domain to an IP address before allowing the connection
      // to completely prevent DNS rebinding and clever SSRF techniques.
      // However, we are improving the string check to avoid false positives.

      return true;
    } catch {
      return false; // Invalid URL format
    }
  }

  async scrapeCompany(url: string): Promise<ScrapedData> {
    // 🛡️ Sentinel Security Update: SSRF Prevention
    // Validate URL to prevent access to internal networks or local services
    const isSafe = this.isSafeUrl(url);
    if (!isSafe) {
      this.logger.warn(`Rejected unsafe URL attempt: ${url}`);
      throw new BadRequestException('Invalid or restricted URL provided');
    }

    this.logger.log(`Scraping URL: ${url}`);

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
