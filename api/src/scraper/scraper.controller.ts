import { Controller, Get, Query } from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get('company')
  async scrapeCompany(@Query('url') url: string): Promise<any> {
    return this.scraperService.scrapeCompany(url);
  }
}
