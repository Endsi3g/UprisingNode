import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import { BadRequestException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as dns from 'dns/promises';

// Mock Puppeteer
const mockPage = {
  goto: jest.fn(),
  evaluate: jest.fn().mockResolvedValue({
    title: 'Mock Title',
    description: 'Mock Description',
    headings: ['Mock Heading 1'],
  }),
  setRequestInterception: jest.fn(),
  on: jest.fn(), // Mock the event listener
  close: jest.fn(),
};

const mockBrowser = {
  newPage: jest.fn().mockResolvedValue(mockPage),
  close: jest.fn(),
};

jest.mock('puppeteer', () => ({
  launch: jest.fn(),
}));

// Mock DNS
jest.mock('dns/promises', () => ({
  lookup: jest.fn(),
}));

describe('ScraperService', () => {
  let service: ScraperService;

  beforeEach(async () => {
    (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser);

    const module: TestingModule = await Test.createTestingModule({
      providers: [ScraperService],
    }).compile();

    service = module.get<ScraperService>(ScraperService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('scrapeCompany', () => {
    it('should throw BadRequestException for invalid protocol', async () => {
      await expect(service.scrapeCompany('ftp://example.com')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for localhost', async () => {
      (dns.lookup as jest.Mock).mockResolvedValue({ address: '127.0.0.1', family: 4 });
      await expect(service.scrapeCompany('http://localhost')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for private IPv4 (192.168.x.x)', async () => {
      (dns.lookup as jest.Mock).mockResolvedValue({ address: '192.168.1.1', family: 4 });
      await expect(service.scrapeCompany('http://192.168.1.1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for private IPv4 (10.x.x.x)', async () => {
      (dns.lookup as jest.Mock).mockResolvedValue({ address: '10.0.0.1', family: 4 });
      await expect(service.scrapeCompany('http://10.0.0.1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for private IPv6 (::1)', async () => {
      (dns.lookup as jest.Mock).mockResolvedValue({ address: '::1', family: 6 });
      await expect(service.scrapeCompany('http://[::1]')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should enable request interception and set up listener', async () => {
      (dns.lookup as jest.Mock).mockResolvedValue({ address: '8.8.8.8', family: 4 });

      await service.scrapeCompany('https://example.com');

      expect(mockPage.setRequestInterception).toHaveBeenCalledWith(true);
      expect(mockPage.on).toHaveBeenCalledWith('request', expect.any(Function));
    });

    it('should proceed for valid public URL', async () => {
      (dns.lookup as jest.Mock).mockResolvedValue({ address: '8.8.8.8', family: 4 });

      const result = await service.scrapeCompany('https://example.com');

      expect(result).toEqual({
        title: 'Mock Title',
        description: 'Mock Description',
        headings: ['Mock Heading 1'],
      });
      expect(puppeteer.launch).toHaveBeenCalled();
    });
  });
});
