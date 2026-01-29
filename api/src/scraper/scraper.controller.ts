import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ScraperService, ScrapedData } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Post('company')
  async scrapeCompany(@Body('url') url: string): Promise<ScrapedData> {
    if (!url) {
      throw new BadRequestException('URL is required');
    }
    return this.scraperService.scrapeCompany(url);
  }
}
