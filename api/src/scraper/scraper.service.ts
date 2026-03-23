import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';

export interface ScrapedData {
  title: string;
  description: string;
  headings: string[];
}

// 🛡️ Sentinel: Validate URL to prevent Server-Side Request Forgery (SSRF)
// Blocks internal IP addresses, localhost, and metadata endpoints.
function isSafeUrl(inputUrl: string): boolean {
  try {
    const parsed = new URL(inputUrl);

    // Only allow HTTP and HTTPS
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }

    const hostname = parsed.hostname;

    // Block localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return false;
    }

    // Block IPv4 loopback, private networks, and link-local (including metadata endpoints)
    const ipv4Regex = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
    const match = hostname.match(ipv4Regex);
    if (match) {
      const octet1 = parseInt(match[1] || '0', 10);
      const octet2 = parseInt(match[2] || '0', 10);

      // 10.0.0.0/8
      if (octet1 === 10) return false;
      // 172.16.0.0/12
      if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) return false;
      // 192.168.0.0/16
      if (octet1 === 192 && octet2 === 168) return false;
      // 169.254.0.0/16 (AWS metadata, etc)
      if (octet1 === 169 && octet2 === 254) return false;
      // 127.0.0.0/8 (Loopback)
      if (octet1 === 127) return false;
      // 0.0.0.0/8
      if (octet1 === 0) return false;
    }

    // Block IPv6 loopback and private networks (simplified check)
    if (
      hostname === '[::1]' ||
      hostname.startsWith('[fc') ||
      hostname.startsWith('[fd') ||
      hostname.startsWith('[fe8') ||
      hostname === '::1'
    ) {
      return false;
    }

    // Block internal domains (.local, .internal)
    if (hostname.endsWith('.local') || hostname.endsWith('.internal')) {
      return false;
    }

    return true;
  } catch {
    return false; // Invalid URL
  }
}

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  async scrapeCompany(url: string): Promise<ScrapedData> {
    this.logger.log(`Scraping URL: ${url}`);

    if (!isSafeUrl(url)) {
      this.logger.warn(`SSRF attempt blocked. Invalid or unsafe URL: ${url}`);
      throw new BadRequestException('Invalid or unsafe URL provided.');
    }

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
