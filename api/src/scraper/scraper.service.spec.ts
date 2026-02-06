/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';

// Mock puppeteer
jest.mock('puppeteer', () => ({
  launch: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      goto: jest.fn().mockResolvedValue(undefined),
      evaluate: jest.fn().mockResolvedValue({
        title: 'Mock Title',
        description: 'Mock Description',
        headings: ['Heading 1'],
      }),
      close: jest.fn().mockResolvedValue(undefined),
    }),
    close: jest.fn().mockResolvedValue(undefined),
  }),
}));

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

  describe('scrapeCompany', () => {
    it('should throw error for file protocol', async () => {
      await expect(service.scrapeCompany('file:///etc/passwd')).rejects.toThrow(/Invalid URL protocol/);
    });

    it('should throw error for ftp protocol', async () => {
      await expect(service.scrapeCompany('ftp://example.com')).rejects.toThrow(/Invalid URL protocol/);
    });

    it('should throw error for localhost', async () => {
      await expect(service.scrapeCompany('http://localhost:3000')).rejects.toThrow(/Access to private network addresses is denied/);
    });

    it('should throw error for 127.0.0.1', async () => {
      await expect(service.scrapeCompany('http://127.0.0.1')).rejects.toThrow(/Access to private network addresses is denied/);
    });

    it('should throw error for [::1]', async () => {
      await expect(service.scrapeCompany('http://[::1]')).rejects.toThrow(/Access to private network addresses is denied/);
    });

    it('should throw error for AWS metadata IP', async () => {
      await expect(service.scrapeCompany('http://169.254.169.254/latest/meta-data/')).rejects.toThrow(/Access to private network addresses is denied/);
    });

    it('should allow valid http/https URLs', async () => {
      const result = await service.scrapeCompany('https://example.com');
      expect(result).toBeDefined();
      expect(result.title).toBe('Mock Title');
    });
  });
});
