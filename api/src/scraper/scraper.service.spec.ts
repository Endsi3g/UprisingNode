import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';

// Mock puppeteer

jest.mock('puppeteer', () => ({
  launch: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      goto: jest.fn(),
      evaluate: jest.fn().mockResolvedValue({
        title: 'Mock Title',
        description: 'Mock Description',
        headings: [],
      }),
      close: jest.fn(),
    }),
    close: jest.fn(),
  }),
}));

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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  describe('scrapeCompany', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    it('should throw BadRequestException for invalid URL format', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await expect(service.scrapeCompany('not-a-url')).rejects.toThrow();
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    it('should throw BadRequestException for file protocol', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await expect(
        service.scrapeCompany('file:///etc/passwd'),
      ).rejects.toThrow();
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    it('should throw BadRequestException for ftp protocol', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await expect(
        service.scrapeCompany('ftp://example.com'),
      ).rejects.toThrow();
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    it('should throw BadRequestException for localhost', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await expect(
        service.scrapeCompany('http://localhost:3000'),
      ).rejects.toThrow();
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    it('should throw BadRequestException for 127.0.0.1', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await expect(
        service.scrapeCompany('http://127.0.0.1:3000'),
      ).rejects.toThrow();
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    it('should allow valid https URLs', async () => {
      // This should pass (or at least fail on puppeteer logic, but not validation)
      // Since we mocked puppeteer, it should return data
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await service.scrapeCompany('https://example.com');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      expect(result).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      expect(result.title).toBe('Mock Title');
    });
  });
});
