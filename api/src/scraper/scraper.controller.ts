import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Post('company')
  async scrapeCompany(@Body('url') url: string) {
    if (!url) {
      throw new BadRequestException('URL is required');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.scraperService.scrapeCompany(url);
  }
}
