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
  private launchingPromise: Promise<void> | null = null;
  private isDestroying = false;

  // Concurrency control
  private readonly MAX_CONCURRENT_REQUESTS = 5;
  private activeRequests = 0;
  private requestQueue: (() => void)[] = [];

  async onModuleInit() {
    await this.initBrowser();
  }

  async onModuleDestroy() {
    this.isDestroying = true;
    if (this.browser) {
      await this.browser.close();
    }
  }

  private async initBrowser(): Promise<void> {
    if (this.browser?.isConnected()) {
      return;
    }

    if (this.launchingPromise) {
      return this.launchingPromise;
    }

    this.launchingPromise = (async () => {
      try {
        this.logger.log('Launching Puppeteer browser...');
        this.browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        this.browser.on('disconnected', () => {
          if (this.isDestroying) return;

          this.logger.warn('Browser disconnected! Attempting to restart...');
          this.browser = null;
          this.launchingPromise = null;

          // Attempt restart
          this.initBrowser().catch((err) =>
            this.logger.error(
              'Failed to restart browser',
              (err as Error).stack,
            ),
          );
        });

        this.logger.log('Browser launched successfully.');
      } catch (error) {
        this.logger.error('Failed to launch browser', (error as Error).stack);
        this.browser = null;
        throw error;
      } finally {
        if (!this.browser) {
          this.launchingPromise = null;
        }
      }
    })();

    return this.launchingPromise;
  }

  private async acquireSlot(): Promise<void> {
    if (this.activeRequests < this.MAX_CONCURRENT_REQUESTS) {
      this.activeRequests++;
      return;
    }
    return new Promise<void>((resolve) => {
      this.requestQueue.push(resolve);
    });
  }

  private releaseSlot(): void {
    const next = this.requestQueue.shift();
    if (next) {
      next();
    } else {
      this.activeRequests--;
    }
  }

  async scrapeCompany(url: string): Promise<any> {
    await this.acquireSlot();

    try {
      await this.initBrowser();
      if (!this.browser) {
        throw new Error('Browser not available');
      }

      this.logger.log(`Scraping URL: ${url}`);

      // Use a new context for isolation
      const context = await this.browser.createBrowserContext();

      try {
        const page = await context.newPage();

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
      this.logger.error(`Failed to scrape ${url}`, (error as Error).stack);
      throw new Error(`Scraping failed: ${(error as Error).message}`);
    } finally {
      this.releaseSlot();
    }
  }
}
