import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';

@Injectable()
export class ScraperService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(ScraperService.name);
    private browser: Browser;
    private browserLaunchPromise: Promise<Browser> | null = null;

    async onModuleInit() {
        await this.ensureBrowser();
    }

    async onModuleDestroy() {
        if (this.browserLaunchPromise) {
            try {
                await this.browserLaunchPromise;
            } catch (e) {
                // Ignore errors during destroy
            }
        }
        if (this.browser) {
            await this.browser.close();
        }
    }

    private async ensureBrowser() {
        if (this.browser && this.browser.isConnected()) {
            return;
        }

        if (!this.browserLaunchPromise) {
            this.logger.log('Launching new browser instance...');
            this.browserLaunchPromise = puppeteer.launch({
                headless: true, // Run in headless mode
                args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some environments
            }).then(browser => {
                this.browser = browser;
                this.browserLaunchPromise = null;
                return browser;
            }).catch(error => {
                this.browserLaunchPromise = null;
                throw error;
            });
        }

        await this.browserLaunchPromise;
    }

    async scrapeCompany(url: string, retryCount = 0): Promise<any> {
        this.logger.log(`Scraping URL: ${url}`);

        try {
            await this.ensureBrowser();
        } catch (error) {
            this.logger.error('Failed to launch browser', error.stack);
            throw new Error('Service unavailable: Browser failed to launch');
        }

        let context;
        try {
            context = await this.browser.createBrowserContext();
            const page = await context.newPage();

            // Navigate to the URL
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

            // Extract data
            const data = await page.evaluate(() => {
                const title = document.title;
                const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
                const headings = Array.from(document.querySelectorAll('h1, h2')).map(h => h.textContent?.trim()).filter(Boolean);

                return {
                    title,
                    description,
                    headings
                };
            });

            this.logger.log(`Successfully scraped data for ${url}`);
            return data;

        } catch (error) {
            const isBrowserError = !this.browser?.isConnected() || error.message.includes('Target closed') || error.message.includes('Session closed');

            if (isBrowserError && retryCount < 1) {
                this.logger.warn(`Browser issue detected (${error.message}). Restarting browser and retrying scrape...`);
                // Force reset browser logic is handled by ensureBrowser next time,
                // but we should probably close the existing disconnected instance if possible?
                // Actually if it's disconnected, close might fail or hang, but ensureBrowser will see isConnected()=false.

                // We don't need to manually set this.browser = null because ensureBrowser checks isConnected.
                // However, to be cleaner, we can try to close it if it's not null.
                 try {
                    if (this.browser) await this.browser.close();
                } catch (e) {}

                return this.scrapeCompany(url, retryCount + 1);
            }

            this.logger.error(`Failed to scrape ${url}`, error.stack);
            throw new Error(`Scraping failed: ${error.message}`);
        } finally {
            if (context) {
                try {
                    await context.close();
                } catch (e) {
                    // Context might be already closed if browser crashed
                }
            }
        }
    }
}
