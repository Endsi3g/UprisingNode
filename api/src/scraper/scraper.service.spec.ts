/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import { BadRequestException } from '@nestjs/common';
import * as dns from 'node:dns/promises';

// Mock Puppeteer
jest.mock('puppeteer', () => ({
  launch: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      goto: jest.fn(),
      evaluate: jest.fn().mockResolvedValue({ title: 'Test Title' }),
      close: jest.fn(), // Page close (not strictly needed by service but good practice)
    }),
    close: jest.fn(), // Browser close
  }),
}));

// Mock DNS
jest.mock('node:dns/promises', () => ({
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

  describe('scrapeCompany', () => {
    it('should throw BadRequestException for private IPv4 (127.0.0.1)', async () => {
      (dns.lookup as jest.Mock).mockResolvedValue({
        address: '127.0.0.1',
        family: 4,
      });
      await expect(service.scrapeCompany('http://127.0.0.1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for private IPv4 (192.168.1.1)', async () => {
      (dns.lookup as jest.Mock).mockResolvedValue({
        address: '192.168.1.1',
        family: 4,
      });
      await expect(service.scrapeCompany('http://192.168.1.1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for private IPv4 (10.0.0.1)', async () => {
      (dns.lookup as jest.Mock).mockResolvedValue({
        address: '10.0.0.1',
        family: 4,
      });
      await expect(service.scrapeCompany('http://10.0.0.1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for loopback IPv6 (::1)', async () => {
      (dns.lookup as jest.Mock).mockResolvedValue({
        address: '::1',
        family: 6,
      });
      await expect(service.scrapeCompany('http://[::1]')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should allow public IP (8.8.8.8)', async () => {
      (dns.lookup as jest.Mock).mockResolvedValue({
        address: '8.8.8.8',
        family: 4,
      });
      await expect(
        service.scrapeCompany('http://8.8.8.8'),
      ).resolves.not.toThrow();
    });

    it('should throw BadRequestException for invalid protocol (ftp)', async () => {
      // DNS lookup might happen first depending on implementation, but protocol check should be first ideally.
      // But if we mock DNS lookup to succeed, protocol check should still fail.
      (dns.lookup as jest.Mock).mockResolvedValue({
        address: '8.8.8.8',
        family: 4,
      });
      await expect(service.scrapeCompany('ftp://example.com')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
