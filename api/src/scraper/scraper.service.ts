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
  private browser: Browser | null = null;
  private browserPromise: Promise<Browser> | null = null;

  async onModuleInit() {
    await this.ensureBrowser();
  }

  async onModuleDestroy() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  private async ensureBrowser(): Promise<Browser> {
    if (this.browser && this.browser.isConnected()) {
      return this.browser;
    }

    if (!this.browserPromise) {
      this.browserPromise = this.launchBrowser()
        .then((browser) => {
          this.browser = browser;
          this.browserPromise = null;
          return browser;
        })
        .catch((err) => {
          this.browserPromise = null;
          throw err;
        });
    }

    return this.browserPromise;
  }

  private async launchBrowser(): Promise<Browser> {
    this.logger.log('Launching Puppeteer browser...');
    const browser = await puppeteer.launch({
      headless: true, // Run in headless mode
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some environments
    });

    // Close initial blank page(s)
    const pages = await browser.pages();
    for (const page of pages) {
      await page.close();
    }

    browser.on('disconnected', () => {
      this.logger.warn('Browser disconnected.');
      if (this.browser === browser) {
        this.browser = null;
      }
    });

    return browser;
  }

  async scrapeCompany(url: string): Promise<any> {
    this.logger.log(`Scraping URL: ${url}`);

    const browser = await this.ensureBrowser();

    try {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      try {
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
      } finally {
        await context.close();
      }
    } catch (error) {
      const e = error as Error;
      this.logger.error(`Failed to scrape ${url}`, e.stack);
      throw new Error(`Scraping failed: ${e.message}`);
    }
  }
}
