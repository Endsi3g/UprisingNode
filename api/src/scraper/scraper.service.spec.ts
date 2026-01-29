import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import puppeteer from 'puppeteer';

jest.mock('puppeteer');

describe('ScraperService', () => {
  let service: ScraperService;
  let mockBrowser: any;
  let mockPage: any;
  let mockContext: any;

  beforeEach(async () => {
    // Reset mocks
    jest.clearAllMocks();

    mockPage = {
      goto: jest.fn().mockResolvedValue(undefined),
      evaluate: jest.fn().mockResolvedValue({ title: 'Test', description: 'Desc', headings: [] }),
    };

    mockContext = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn().mockResolvedValue(undefined),
    };

    mockBrowser = {
      createBrowserContext: jest.fn().mockResolvedValue(mockContext),
      close: jest.fn().mockResolvedValue(undefined),
      isConnected: jest.fn().mockReturnValue(true),
    };

    // Default behavior
    (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser);

    const module: TestingModule = await Test.createTestingModule({
      providers: [ScraperService],
    }).compile();

    service = module.get<ScraperService>(ScraperService);
  });

  afterEach(async () => {
    await service.onModuleDestroy();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should launch browser only once across multiple requests', async () => {
    await service.scrapeCompany('http://example.com/1');
    await service.scrapeCompany('http://example.com/2');

    expect(puppeteer.launch).toHaveBeenCalledTimes(1);
  });

  it('should create a new context for each request (isolation)', async () => {
    await service.scrapeCompany('http://example.com/1');
    await service.scrapeCompany('http://example.com/2');

    expect(mockBrowser.createBrowserContext).toHaveBeenCalledTimes(2);
    expect(mockContext.newPage).toHaveBeenCalledTimes(2);
    expect(mockContext.close).toHaveBeenCalledTimes(2);
  });

  it('should recover from browser crash (restart logic)', async () => {
    await service.scrapeCompany('http://example.com/1');
    expect(puppeteer.launch).toHaveBeenCalledTimes(1);

    mockBrowser.isConnected.mockReturnValue(false);

    await service.scrapeCompany('http://example.com/2');

    expect(puppeteer.launch).toHaveBeenCalledTimes(2);
  });

  it('should retry request if browser crashes during scrape', async () => {
    mockBrowser.isConnected.mockReturnValue(true);

    mockBrowser.createBrowserContext
      .mockRejectedValueOnce(new Error('Target closed'))
      .mockResolvedValueOnce(mockContext);

    await service.scrapeCompany('http://example.com/retry');

    expect(puppeteer.launch).toHaveBeenCalled();
    expect(mockBrowser.createBrowserContext).toHaveBeenCalledTimes(2);
  });

  it('should handle concurrent requests and launch browser only once (race condition check)', async () => {
     jest.clearAllMocks(); // Clear previous launch calls

     // Create a delayed launch mock to simulate race condition window
     let resolveLaunch: any;
     const launchPromise = new Promise((resolve) => {
         resolveLaunch = resolve;
     });

     (puppeteer.launch as jest.Mock).mockReturnValue(launchPromise);

     // Fire multiple requests concurrently while browser is "launching"
     const p1 = service.scrapeCompany('url1');
     const p2 = service.scrapeCompany('url2');
     const p3 = service.scrapeCompany('url3');

     // Even before they resolve, launch should have been called EXACTLY once
     expect(puppeteer.launch).toHaveBeenCalledTimes(1);

     // Finish the launch
     resolveLaunch(mockBrowser);

     await Promise.all([p1, p2, p3]);

     // Verify only one launch occurred
     expect(puppeteer.launch).toHaveBeenCalledTimes(1);
  });
});
