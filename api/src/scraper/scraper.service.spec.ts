/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import * as puppeteer from 'puppeteer';
import * as dns from 'dns/promises';

// Mock puppeteer
jest.mock('puppeteer', () => ({
  launch: jest.fn(),
}));

// Mock dns/promises
jest.mock('dns/promises', () => ({
  lookup: jest.fn(),
}));

describe('ScraperService', () => {
  let service: ScraperService;
  let browserMock: any;
  let pageMock: any;

  beforeEach(async () => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup browser and page mocks
    pageMock = {
      goto: jest.fn(),
      evaluate: jest.fn().mockResolvedValue({
        title: 'Test Title',
        description: 'Test Description',
        headings: ['H1', 'H2'],
      }),
      close: jest.fn(),
    };
    browserMock = {
      newPage: jest.fn().mockResolvedValue(pageMock),
      close: jest.fn(),
    };
    (puppeteer.launch as jest.Mock).mockResolvedValue(browserMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [ScraperService],
    }).compile();

    service = module.get<ScraperService>(ScraperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should scrape a valid public URL', async () => {
    (dns.lookup as jest.Mock).mockResolvedValue({ address: '8.8.8.8' }); // Public IP
    const url = 'https://example.com';
    const result = await service.scrapeCompany(url);

    expect(result).toBeDefined();
    expect(puppeteer.launch).toHaveBeenCalled();
    expect(pageMock.goto).toHaveBeenCalledWith(url, expect.anything());
  });

  it('should throw an error for localhost URL', async () => {
    (dns.lookup as jest.Mock).mockResolvedValue({ address: '127.0.0.1' });
    const url = 'http://localhost:3000';

    await expect(service.scrapeCompany(url)).rejects.toThrow();
    expect(puppeteer.launch).not.toHaveBeenCalled();
  });

  it('should throw an error for private IP (10.x.x.x)', async () => {
    (dns.lookup as jest.Mock).mockResolvedValue({ address: '10.0.0.5' });
    const url = 'http://10.0.0.5';

    await expect(service.scrapeCompany(url)).rejects.toThrow();
    expect(puppeteer.launch).not.toHaveBeenCalled();
  });

  it('should throw an error for private IP (192.168.x.x)', async () => {
    (dns.lookup as jest.Mock).mockResolvedValue({ address: '192.168.1.1' });
    const url = 'http://192.168.1.1';

    await expect(service.scrapeCompany(url)).rejects.toThrow();
    expect(puppeteer.launch).not.toHaveBeenCalled();
  });

  it('should throw an error for non-http protocol', async () => {
    const url = 'file:///etc/passwd';
    // dns lookup might not be called or throw, but validateUrl should catch protocol first
    await expect(service.scrapeCompany(url)).rejects.toThrow();
    expect(puppeteer.launch).not.toHaveBeenCalled();
  });
});
