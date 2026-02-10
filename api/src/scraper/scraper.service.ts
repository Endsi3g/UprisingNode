import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import puppeteer, { Browser, Page, BrowserContext } from 'puppeteer';

export interface ScrapedData {
  title: string;
  description: string;
  headings: string[];
}

@Injectable()
export class ScraperService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ScraperService.name);
  private browserPromise: Promise<Browser> | null = null;

  async onModuleInit() {
    this.logger.log('Initializing ScraperService...');
    // Pre-launch browser
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.getBrowser();
    // Satisfy require-await
    return Promise.resolve();
  }

  async onModuleDestroy() {
    if (this.browserPromise) {
      this.logger.log('Closing Puppeteer browser instance...');
      try {
        const browser = await this.browserPromise;
        if (browser && browser.isConnected()) {
          await browser.close();
        }
      } catch (e: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.logger.warn(`Error closing browser: ${e.message}`);
      }
      this.browserPromise = null;
    }
  }

  private async getBrowser(): Promise<Browser> {
    if (!this.browserPromise) {
      this.browserPromise = this.launchBrowser();
    }

    // eslint-disable-next-line no-useless-catch
    try {
      const browser = await this.browserPromise;
      if (!browser.isConnected()) {
        this.logger.warn(
          'Browser found disconnected during getBrowser, relaunching...',
        );
        this.browserPromise = null;
        return this.getBrowser();
      }
      return browser;
    } catch (e) {
      // If launch failed, the launchBrowser method resets browserPromise.
      // But we need to rethrow here so the caller knows it failed.
      throw e;
    }
  }

  private async launchBrowser(): Promise<Browser> {
    this.logger.log('Launching new Puppeteer browser instance...');
    try {
      const browser = await puppeteer.launch({
        headless: true, // Run in headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some environments
      });

      browser.on('disconnected', () => {
        this.logger.warn('Puppeteer browser disconnected.');
        this.browserPromise = null;
      });

      return browser;
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error('Failed to launch browser', error.stack);
      this.browserPromise = null; // Reset on failure so next call tries again
      throw error;
    }
  }

  async scrapeCompany(url: string): Promise<ScrapedData> {
    this.logger.log(`Scraping URL: ${url}`);

    let context: BrowserContext | undefined;
    let page: Page | undefined;
    try {
      const browser = await this.getBrowser();
      // Create a new context for isolation
      context = await browser.createBrowserContext();
      page = await context.newPage();

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
        } as ScrapedData;
      });

      this.logger.log(`Successfully scraped data for ${url}`);
      return data;
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`Failed to scrape ${url}`, error.stack);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Scraping failed: ${error.message}`);
    } finally {
      if (page) {
        try {
          await page.close();
        } catch (e: any) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          this.logger.warn(`Failed to close page: ${e.message}`);
        }
      }
      if (context) {
        try {
          await context.close();
        } catch (e: any) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          this.logger.warn(`Failed to close context: ${e.message}`);
        }
      }
    }
  }
}
