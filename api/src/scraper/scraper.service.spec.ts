import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import * as dns from 'dns/promises';
import { BadRequestException } from '@nestjs/common';

// Mock puppeteer
jest.mock('puppeteer', () => ({
  launch: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      goto: jest.fn().mockResolvedValue(null),
      evaluate: jest.fn().mockResolvedValue({
        title: 'Mock Title',
        description: 'Mock Description',
        headings: ['Heading 1'],
      }),
      close: jest.fn().mockResolvedValue(null),
    }),
    close: jest.fn().mockResolvedValue(null),
  }),
}));

// Mock dns
jest.mock('dns/promises', () => ({
  lookup: jest.fn(),
}));

describe('ScraperService', () => {
  let service: ScraperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScraperService],
    }).compile();

    service = module.get<ScraperService>(ScraperService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('scrapeCompany validation', () => {
    it('should throw BadRequestException for invalid protocol', async () => {
      await expect(service.scrapeCompany('ftp://example.com')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for localhost (IPv4)', async () => {
      (dns.lookup as jest.Mock).mockResolvedValue({ address: '127.0.0.1' });
      await expect(service.scrapeCompany('http://localhost')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for localhost (IPv6)', async () => {
      (dns.lookup as jest.Mock).mockResolvedValue({ address: '::1' });
      await expect(service.scrapeCompany('http://[::1]')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for private IP 192.168.x.x', async () => {
      (dns.lookup as jest.Mock).mockResolvedValue({ address: '192.168.1.1' });
      await expect(service.scrapeCompany('http://192.168.1.1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for AWS metadata service (169.254.x.x)', async () => {
      (dns.lookup as jest.Mock).mockResolvedValue({
        address: '169.254.169.254',
      });
      await expect(
        service.scrapeCompany('http://169.254.169.254'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should allow public IPs', async () => {
      (dns.lookup as jest.Mock).mockResolvedValue({ address: '93.184.216.34' }); // example.com

      const result = await service.scrapeCompany('http://example.com');
      expect(result).toBeDefined();
      expect(result.title).toBe('Mock Title');
    });
  });
});
