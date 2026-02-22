/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import { BadRequestException } from '@nestjs/common';
import * as dns from 'dns/promises';
import puppeteer from 'puppeteer';

// Mock dns
jest.mock('dns/promises');

// Mock puppeteer module structure
jest.mock('puppeteer', () => ({
  launch: jest.fn(),
}));

describe('ScraperService', () => {
  let service: ScraperService;
  let lookupMock: jest.Mock;

  // Define mock objects
  const mockRequest = {
    url: jest.fn(),
    continue: jest.fn(),
    abort: jest.fn(),
  };

  const mockPage = {
    goto: jest.fn(),
    evaluate: jest.fn(),
    setRequestInterception: jest.fn(),
    on: jest.fn(),
    close: jest.fn(),
    _requestHandler: null as any,
  };

  const mockBrowser = {
    newPage: jest.fn(),
    close: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    // Setup puppeteer mock return values
    (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser);
    mockBrowser.newPage.mockResolvedValue(mockPage);

    mockPage.evaluate.mockResolvedValue({
      title: 'Test Page',
      description: 'Test Description',
      headings: ['H1', 'H2'],
    });

    // Handle 'on' event listener
    mockPage.on.mockImplementation((event: string, handler: any) => {
      if (event === 'request') {
        mockPage._requestHandler = handler;
      }
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [ScraperService],
    }).compile();

    service = module.get<ScraperService>(ScraperService);
    lookupMock = dns.lookup as jest.Mock;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should enable request interception', async () => {
    lookupMock.mockResolvedValue({ address: '8.8.8.8', family: 4 });
    await service.scrapeCompany('https://google.com');
    expect(mockPage.setRequestInterception).toHaveBeenCalledWith(true);
    expect(mockPage.on).toHaveBeenCalledWith('request', expect.any(Function));
  });

  it('should allow valid public URL in request interception', async () => {
    lookupMock.mockResolvedValue({ address: '8.8.8.8', family: 4 });

    const scrapePromise = service.scrapeCompany('https://google.com');

    // Wait for the request handler to be registered
    await new Promise((resolve) => setTimeout(resolve, 0));

    const handler = mockPage._requestHandler;
    expect(handler).toBeDefined();

    mockRequest.url.mockReturnValue('https://google.com');
    await handler(mockRequest);

    expect(mockRequest.continue).toHaveBeenCalled();
    expect(mockRequest.abort).not.toHaveBeenCalled();

    await scrapePromise;
  });

  it('should abort invalid URL (redirect to private IP) in request interception', async () => {
    // Initial check (valid)
    lookupMock.mockResolvedValueOnce({ address: '8.8.8.8', family: 4 });
    // Request check (invalid)
    lookupMock.mockResolvedValueOnce({ address: '127.0.0.1', family: 4 });

    const scrapePromise = service.scrapeCompany('https://google.com');

    await new Promise((resolve) => setTimeout(resolve, 0));
    const handler = mockPage._requestHandler;
    expect(handler).toBeDefined();

    mockRequest.url.mockReturnValue('https://google.com/redirect');
    await handler(mockRequest);

    expect(mockRequest.abort).toHaveBeenCalledWith('accessdenied');
    expect(mockRequest.continue).not.toHaveBeenCalled();

    await scrapePromise;
  });

  it('should reject initial invalid URL', async () => {
    lookupMock.mockResolvedValue({ address: '127.0.0.1', family: 4 });
    await expect(service.scrapeCompany('http://localhost')).rejects.toThrow(
      BadRequestException,
    );
    expect(mockPage.setRequestInterception).not.toHaveBeenCalled();
  });
});
