import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
describe('ScraperService', () => {
  let service: ScraperService;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScraperService],
    }).compile();

    service = module.get<ScraperService>(ScraperService);
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  it('should be defined', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    expect(service).toBeDefined();
  });
});
