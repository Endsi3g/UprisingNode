import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';

@Injectable()
export class ScraperService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ScraperService.name);
  private browserPromise: Promise<Browser> | null = null;

  async onModuleInit() {
    this.logger.log('Initializing ScraperService...');
    // Pre-launch browser
    await this.getBrowser();
  }

  async onModuleDestroy() {
    if (this.browserPromise) {
      this.logger.log('Closing Puppeteer browser instance...');
      try {
        const browser = await this.browserPromise;
        if (browser && browser.isConnected()) {
          await browser.close();
        }
      } catch (e) {
        this.logger.warn(`Error closing browser: ${e.message}`);
      }
      this.browserPromise = null;
    }
  }

  private async getBrowser(): Promise<Browser> {
    if (!this.browserPromise) {
      this.browserPromise = this.launchBrowser();
    }

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
    } catch (error) {
      this.logger.error('Failed to launch browser', error.stack);
      this.browserPromise = null; // Reset on failure so next call tries again
      throw error;
    }
  }

  async scrapeCompany(url: string): Promise<any> {
    this.logger.log(`Scraping URL: ${url}`);

    let context;
    let page;
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
        };
      });

      this.logger.log(`Successfully scraped data for ${url}`);
      return data;
    } catch (error) {
      this.logger.error(`Failed to scrape ${url}`, error.stack);
      throw new Error(`Scraping failed: ${error.message}`);
    } finally {
      if (page) {
        try {
          await page.close();
        } catch (e) {
          this.logger.warn(`Failed to close page: ${e.message}`);
        }
      }
      if (context) {
        try {
          await context.close();
        } catch (e) {
          this.logger.warn(`Failed to close context: ${e.message}`);
        }
      }
    }
  }
}
