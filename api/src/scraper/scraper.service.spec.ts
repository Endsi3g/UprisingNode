/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import { BadRequestException } from '@nestjs/common';
import * as dns from 'dns/promises';
import puppeteer from 'puppeteer';

jest.mock('dns/promises');
jest.mock('puppeteer');

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

  describe('SSRF Protection', () => {
    it('should throw BadRequestException for invalid protocol', async () => {
      await expect(service.scrapeCompany('ftp://example.com')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for localhost (127.0.0.1)', async () => {
      (dns.lookup as jest.Mock).mockResolvedValue({ address: '127.0.0.1' });
      await expect(service.scrapeCompany('http://localhost')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for private IP (192.168.1.1)', async () => {
      (dns.lookup as jest.Mock).mockResolvedValue({ address: '192.168.1.1' });
      await expect(
        service.scrapeCompany('http://internal-site.com'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for AWS Metadata IP (169.254.169.254)', async () => {
      (dns.lookup as jest.Mock).mockResolvedValue({
        address: '169.254.169.254',
      });
      await expect(
        service.scrapeCompany('http://169.254.169.254'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for IPv6 Loopback (::1)', async () => {
      (dns.lookup as jest.Mock).mockResolvedValue({ address: '::1' });
      await expect(service.scrapeCompany('http://[::1]')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should allow public IP and proceed to scrape', async () => {
      (dns.lookup as jest.Mock).mockResolvedValue({ address: '8.8.8.8' });

      const mockPage = {
        goto: jest.fn().mockResolvedValue(null),
        evaluate: jest.fn().mockResolvedValue({
          title: 'Example',
          description: 'Test',
          headings: [],
        }),
      };

      const mockBrowser = {
        newPage: jest.fn().mockResolvedValue(mockPage),
        close: jest.fn().mockResolvedValue(null),
      };

      (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser);

      const result = await service.scrapeCompany('http://example.com');

      expect(dns.lookup).toHaveBeenCalledWith('example.com');
      expect(puppeteer.launch).toHaveBeenCalled();
      expect(mockPage.goto).toHaveBeenCalledWith(
        'http://example.com',
        expect.any(Object),
      );
      expect(result).toEqual({
        title: 'Example',
        description: 'Test',
        headings: [],
      });
    });
  });
});
