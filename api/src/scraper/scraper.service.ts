import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import type { Browser } from 'puppeteer';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  private isSafeUrl(urlString: string): boolean {
    try {
      const url = new URL(urlString);

      // Strictly allow only http and https protocols
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return false;
      }

      const hostname = url.hostname;

      // Block localhosts and cloud metadata
      const blockedHostnames = ['localhost', '[::1]', '169.254.169.254'];
      if (blockedHostnames.includes(hostname)) {
        return false;
      }

      // Block private IP ranges and loopback (simplified IPv4 check)
      const ipMatch = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.exec(hostname);
      if (ipMatch) {
        const octet1 = parseInt(ipMatch[1], 10);
        const octet2 = parseInt(ipMatch[2], 10);

        // 127.0.0.0 - 127.255.255.255 (Loopback)
        if (octet1 === 127) return false;
        // 10.0.0.0 - 10.255.255.255 (Private)
        if (octet1 === 10) return false;
        // 172.16.0.0 - 172.31.255.255 (Private)
        if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) return false;
        // 192.168.0.0 - 192.168.255.255 (Private)
        if (octet1 === 192 && octet2 === 168) return false;
      }

      return true;
    } catch {
      return false; // Invalid URL format
    }
  }

  async scrapeCompany(url: string): Promise<Record<string, unknown>> {
    this.logger.log(`Scraping URL: ${url}`);

    if (!this.isSafeUrl(url)) {
      this.logger.warn(`Blocked unsafe URL: ${url}`);
      throw new BadRequestException('Invalid or blocked URL');
    }

    let browser: Browser | undefined;
    try {
      browser = (await puppeteer.launch({
        headless: true, // Run in headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some environments
      })) as unknown as Browser;

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
      throw new BadRequestException(`Scraping failed`); // Don't leak exact error details
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
