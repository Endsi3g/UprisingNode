import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';

describe('ScraperService', () => {
  let service: ScraperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScraperService],
    }).compile();

    service = module.get<ScraperService>(ScraperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should reject non-http/https URLs', async () => {
    await expect(service.scrapeCompany('file:///etc/passwd')).rejects.toThrow(
      'Invalid URL protocol',
    );
    await expect(service.scrapeCompany('ftp://example.com')).rejects.toThrow(
      'Invalid URL protocol',
    );
  });
});
