import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import { BadRequestException } from '@nestjs/common';
import { lookup } from 'dns/promises';

// Mock puppeteer
jest.mock('puppeteer', () => ({
  launch: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      goto: jest.fn().mockResolvedValue(null),
      evaluate: jest.fn().mockResolvedValue({
        title: 'Mock Title',
        description: 'Mock Description',
        headings: ['H1', 'H2'],
      }),
      close: jest.fn().mockResolvedValue(null),
    }),
    close: jest.fn().mockResolvedValue(null),
  }),
}));

// Mock dns/promises
jest.mock('dns/promises', () => ({
  lookup: jest.fn(),
}));

describe('ScraperService', () => {
  let service: ScraperService;
  const mockLookup = lookup as jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScraperService],
    }).compile();

    service = module.get<ScraperService>(ScraperService);
    mockLookup.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('scrapeCompany', () => {
    it('should throw BadRequestException for invalid URL', async () => {
      await expect(service.scrapeCompany('invalid-url')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for non-http/https protocols', async () => {
      await expect(service.scrapeCompany('ftp://example.com')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for private IP (localhost)', async () => {
      mockLookup.mockResolvedValue({ address: '127.0.0.1' });
      await expect(service.scrapeCompany('http://localhost')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for private IP (192.168.x.x)', async () => {
      mockLookup.mockResolvedValue({ address: '192.168.1.1' });
      await expect(service.scrapeCompany('http://internal.lan')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for AWS metadata IP', async () => {
      mockLookup.mockResolvedValue({ address: '169.254.169.254' });
      await expect(service.scrapeCompany('http://169.254.169.254')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for 0.0.0.0', async () => {
      mockLookup.mockResolvedValue({ address: '0.0.0.0' });
      await expect(service.scrapeCompany('http://0.0.0.0')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for IPv4-mapped IPv6 loopback', async () => {
      mockLookup.mockResolvedValue({ address: '::ffff:127.0.0.1' });
      await expect(service.scrapeCompany('http://[::ffff:127.0.0.1]')).rejects.toThrow(BadRequestException);
    });

    it('should allow public IP', async () => {
      mockLookup.mockResolvedValue({ address: '93.184.216.34' }); // example.com
      const result = await service.scrapeCompany('http://example.com');
      expect(result).toEqual({
        title: 'Mock Title',
        description: 'Mock Description',
        headings: ['H1', 'H2'],
      });
    });
  });
});
