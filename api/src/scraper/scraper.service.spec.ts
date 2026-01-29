import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import puppeteer from 'puppeteer';

jest.mock('puppeteer');

describe('ScraperService', () => {
  let service: ScraperService;
  let mockBrowser: any;
  let mockContext: any;
  let mockPage: any;

  beforeEach(async () => {
    mockPage = {
      goto: jest.fn().mockResolvedValue(undefined),
      evaluate: jest.fn().mockResolvedValue({
        title: 'Test',
        description: 'Desc',
        headings: ['H1'],
      }),
      close: jest.fn().mockResolvedValue(undefined),
    };

    mockContext = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn().mockResolvedValue(undefined),
    };

    mockBrowser = {
      createBrowserContext: jest.fn().mockResolvedValue(mockContext),
      close: jest.fn().mockResolvedValue(undefined),
      on: jest.fn(),
      isConnected: jest.fn().mockReturnValue(true),
      process: jest.fn().mockReturnValue({ kill: jest.fn() }),
    };

    (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser);

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

  it('should launch browser on module init', async () => {
    await service.onModuleInit();
    expect(puppeteer.launch).toHaveBeenCalledTimes(1);
    expect(mockBrowser.on).toHaveBeenCalledWith(
      'disconnected',
      expect.any(Function),
    );
  });

  it('should scrape using a new context', async () => {
    await service.onModuleInit();
    const result = await service.scrapeCompany('http://test.com');

    expect(mockBrowser.createBrowserContext).toHaveBeenCalledTimes(1);
    expect(mockContext.newPage).toHaveBeenCalledTimes(1);
    expect(mockPage.goto).toHaveBeenCalledWith(
      'http://test.com',
      expect.objectContaining({ waitUntil: 'networkidle2' }),
    );
    expect(mockContext.close).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      title: 'Test',
      description: 'Desc',
      headings: ['H1'],
    });
  });

  it('should close browser on module destroy', async () => {
    await service.onModuleInit();
    await service.onModuleDestroy();
    expect(mockBrowser.close).toHaveBeenCalledTimes(1);
  });
});
