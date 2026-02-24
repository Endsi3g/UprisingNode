/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import { BadRequestException } from '@nestjs/common';
import * as dns from 'dns/promises';

// Mock puppeteer
jest.mock('puppeteer', () => ({
  launch: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      goto: jest.fn().mockResolvedValue(null),
      evaluate: jest.fn().mockResolvedValue({
        title: 'Mock Title',
        description: 'Mock Description',
        headings: [],
      }),
      setRequestInterception: jest.fn().mockResolvedValue(null),
      on: jest.fn(),
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScraperService],
    }).compile();

    service = module.get<ScraperService>(ScraperService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('scrapeCompany validation', () => {
    it('should throw BadRequestException for invalid URL format', async () => {
      await expect(service.scrapeCompany('not-a-url')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for IPv4-mapped IPv6 private IP', async () => {
      (dns.lookup as jest.Mock).mockResolvedValue({
        address: '::ffff:127.0.0.1',
      });
      await expect(
        service.scrapeCompany('http://ipv4-mapped.com'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for non-http/https protocol', async () => {
      await expect(service.scrapeCompany('ftp://example.com')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for private IP (IPv4 - Localhost)', async () => {
      (dns.lookup as jest.Mock).mockResolvedValue({ address: '127.0.0.1' });
      await expect(service.scrapeCompany('http://localhost')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for private IP (IPv4 - 10.x.x.x)', async () => {
      (dns.lookup as jest.Mock).mockResolvedValue({ address: '10.0.0.5' });
      await expect(
        service.scrapeCompany('http://internal.net'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for private IP (IPv6)', async () => {
      (dns.lookup as jest.Mock).mockResolvedValue({ address: '::1' });
      await expect(service.scrapeCompany('http://[::1]')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should allow public IPs', async () => {
      (dns.lookup as jest.Mock).mockResolvedValue({ address: '8.8.8.8' });
      await expect(service.scrapeCompany('http://google.com')).resolves.toEqual(
        {
          title: 'Mock Title',
          description: 'Mock Description',
          headings: [],
        },
      );
    });

    it('should throw if DNS resolution fails', async () => {
      (dns.lookup as jest.Mock).mockRejectedValue(new Error('DNS Error'));
      await expect(
        service.scrapeCompany('http://unknown-domain.com'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
