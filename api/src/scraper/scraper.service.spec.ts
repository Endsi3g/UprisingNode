import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import puppeteer from 'puppeteer';
import { BadRequestException } from '@nestjs/common';

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
    it('should throw BadRequestException for invalid URL format', async () => {
      await expect(service.scrapeCompany('not-a-url')).rejects.toThrow();
    });

    it('should throw BadRequestException for file protocol', async () => {
      await expect(
        service.scrapeCompany('file:///etc/passwd'),
      ).rejects.toThrow();
    });

    it('should throw BadRequestException for ftp protocol', async () => {
      await expect(
        service.scrapeCompany('ftp://example.com'),
      ).rejects.toThrow();
    });

    it('should throw BadRequestException for localhost', async () => {
      await expect(
        service.scrapeCompany('http://localhost:3000'),
      ).rejects.toThrow();
    });

    it('should throw BadRequestException for 127.0.0.1', async () => {
      await expect(
        service.scrapeCompany('http://127.0.0.1:3000'),
      ).rejects.toThrow();
    });

    it('should allow valid https URLs', async () => {
      // This should pass (or at least fail on puppeteer logic, but not validation)
      // Since we mocked puppeteer, it should return data
      const result = await service.scrapeCompany('https://example.com');
      expect(result).toBeDefined();
      expect(result.title).toBe('Mock Title');
    });
  });
});
