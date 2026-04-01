import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import type { Browser } from 'puppeteer';
import puppeteer from 'puppeteer';

export interface ScrapedData {
  title: string;
  description: string;
  headings: string[];
}

function isSafeUrl(urlString: string): boolean {
  try {
    const parsedUrl = new URL(urlString);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }
    const hostname = parsedUrl.hostname;

    // Block IP addresses (basic check for SSRF prevention)
    const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (ipv4Regex.test(hostname)) {
      const parts = hostname.split('.').map(Number);
      if (
        parts[0] === 127 || // localhost
        parts[0] === 10 || // private 10.x.x.x
        (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || // private 172.16.x.x - 172.31.x.x
        (parts[0] === 192 && parts[1] === 168) || // private 192.168.x.x
        (parts[0] === 169 && parts[1] === 254) // cloud metadata
      ) {
        return false;
      }
    }

    // Block specific hostnames
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.local')
    ) {
      return false;
    }

    // Block IPv6 localhost
    if (hostname === '[::1]' || hostname === '::1') {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  async scrapeCompany(url: string): Promise<ScrapedData> {
    if (!isSafeUrl(url)) {
      throw new BadRequestException('Invalid or unsafe URL provided');
    }
    this.logger.log(`Scraping URL: ${url}`);

    let browser: Browser | undefined;
    try {
      browser = (await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })) as unknown as Browser;

      if (!browser) {
        throw new Error('Failed to launch browser');
      }

      const page = await browser.newPage();

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
