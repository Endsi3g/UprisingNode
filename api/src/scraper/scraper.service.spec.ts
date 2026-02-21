/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import { BadRequestException } from '@nestjs/common';
import { lookup } from 'dns/promises';

// Mock dns/promises
jest.mock('dns/promises');

// Mock puppeteer
jest.mock('puppeteer', () => ({
  launch: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      goto: jest.fn(),
      evaluate: jest.fn().mockResolvedValue({
        title: 'Test',
        description: 'Test Desc',
        headings: [],
      }),
      close: jest.fn(),
    }),
    close: jest.fn(),
  }),
}));

describe('ScraperService', () => {
  let service: ScraperService;
  const mockLookup = lookup as jest.Mock;

  beforeEach(async () => {
    mockLookup.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ScraperService],
    }).compile();

    service = module.get<ScraperService>(ScraperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('scrapeCompany validation', () => {
    it('should throw BadRequestException for invalid URL format', async () => {
      // No need to mock lookup as it fails before resolution
      await expect(service.scrapeCompany('invalid-url')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for non-http/https protocols', async () => {
      await expect(service.scrapeCompany('ftp://example.com')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.scrapeCompany('file:///etc/passwd')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for localhost', async () => {
      await expect(service.scrapeCompany('http://localhost')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.scrapeCompany('http://127.0.0.1')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.scrapeCompany('http://[::1]')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for private IP addresses resolved via DNS', async () => {
      mockLookup.mockResolvedValue([{ address: '192.168.1.1', family: 4 }]);
      await expect(
        service.scrapeCompany('http://private.local'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for IPv6 addresses (blocked for now)', async () => {
      mockLookup.mockResolvedValue([{ address: '2001:db8::1', family: 6 }]);
      await expect(service.scrapeCompany('http://ipv6.local')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should allow valid public URLs', async () => {
      mockLookup.mockResolvedValue([{ address: '8.8.8.8', family: 4 }]);
      const result = await service.scrapeCompany('http://google.com');
      expect(result).toBeDefined();
      expect(result.title).toBe('Test');
    });
  });
});
