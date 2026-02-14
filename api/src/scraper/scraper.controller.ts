import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get('company')
  async scrapeCompany(@Query('url') url: string) {
    if (!url) {
      throw new BadRequestException('URL is required');
    }

    return this.scraperService.scrape(url);
  }
}
