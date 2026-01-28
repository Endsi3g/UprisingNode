import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Cluster } from 'puppeteer-cluster';

@Injectable()
export class ScraperService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(ScraperService.name);
    private cluster: Cluster;

    async onModuleInit() {
        this.logger.log('Initializing Puppeteer Cluster...');
        this.cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_CONTEXT,
            maxConcurrency: 5, // Adjust based on server resources
            puppeteerOptions: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            } as any,
        });
    }

    async onModuleDestroy() {
        if (this.cluster) {
            this.logger.log('Closing Puppeteer Cluster...');
            await this.cluster.close();
        }
    }

    async scrapeCompany(url: string): Promise<any> {
        this.logger.log(`Scraping URL: ${url}`);

        if (!this.cluster) {
            // Fallback initialization if used outside of module context (e.g. testing)
            // But usually onModuleInit should handle it.
            // For the benchmark script which instantiates the service directly without NestJS app,
            // we might need to manually call onModuleInit or handle it here.
            // Let's assume onModuleInit is called, but for safety in the benchmark script
            // (which instantiates via `new ScraperService()`), the cluster will be undefined unless we call it.
            // I will update the benchmark script later to call onModuleInit,
            // OR I can lazily initialize here.
            // Lazily initializing is safer for the benchmark script if I don't update it.
            // However, explicit lifecycle is better. I'll rely on onModuleInit and update benchmark.
             throw new Error('Cluster not initialized. Call onModuleInit() first.');
        }

        try {
            // Execute the scraping job in the cluster
            const data = await this.cluster.execute(url, async ({ page, data: targetUrl }) => {
                // Navigate to the URL
                await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });

                // Extract data
                return await page.evaluate(() => {
                    const title = document.title;
                    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
                    const headings = Array.from(document.querySelectorAll('h1, h2')).map(h => h.textContent?.trim()).filter(Boolean);

                    return {
                        title,
                        description,
                        headings
                    };
                });
            });

            this.logger.log(`Successfully scraped data for ${url}`);
            return data;

        } catch (error) {
            this.logger.error(`Failed to scrape ${url}`, error.stack);
            throw new Error(`Scraping failed: ${error.message}`);
        }
    }
}
