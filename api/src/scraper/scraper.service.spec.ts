/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import { BadRequestException } from '@nestjs/common';
import * as dns from 'dns/promises';
import puppeteer from 'puppeteer';

jest.mock('dns/promises');
jest.mock('puppeteer');

describe('ScraperService', () => {
  let service: ScraperService;

  const mockPage = {
    goto: jest.fn(),
    evaluate: jest.fn(),
  };

  const mockBrowser = {
    newPage: jest.fn().mockResolvedValue(mockPage),
    close: jest.fn(),
  };

  beforeEach(async () => {
    (puppeteer.launch as unknown as jest.Mock).mockResolvedValue(mockBrowser);

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
    it('should throw BadRequestException if URL format is invalid', async () => {
        await expect(service.scrapeCompany('not-a-url')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if protocol is not http/https', async () => {
        await expect(service.scrapeCompany('ftp://example.com')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if hostname resolves to localhost (127.0.0.1)', async () => {
        (dns.lookup as jest.Mock).mockResolvedValue({ address: '127.0.0.1' });
        await expect(service.scrapeCompany('http://localhost')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if hostname resolves to private IP (192.168.1.1)', async () => {
        (dns.lookup as jest.Mock).mockResolvedValue({ address: '192.168.1.1' });
        await expect(service.scrapeCompany('http://internal.service')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if hostname is IPv6 loopback (::1)', async () => {
         (dns.lookup as jest.Mock).mockResolvedValue({ address: '::1' });
         // The service strips brackets before calling dns.lookup
         await expect(service.scrapeCompany('http://[::1]')).rejects.toThrow(BadRequestException);
         expect(dns.lookup).toHaveBeenCalledWith('::1');
    });

    it('should call puppeteer for valid public URL', async () => {
        (dns.lookup as jest.Mock).mockResolvedValue({ address: '93.184.216.34' }); // example.com IP
        mockPage.evaluate.mockResolvedValue({ title: 'Test', description: 'Desc', headings: [] });

        const result = await service.scrapeCompany('http://example.com');

        expect(dns.lookup).toHaveBeenCalledWith('example.com');
        expect(puppeteer.launch).toHaveBeenCalled();
        expect(mockPage.goto).toHaveBeenCalledWith('http://example.com', expect.any(Object));
        expect(result).toEqual({ title: 'Test', description: 'Desc', headings: [] });
    });
  });
});
