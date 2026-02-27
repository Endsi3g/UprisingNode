/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import puppeteer from 'puppeteer';

jest.mock('puppeteer');

describe('ScraperService', () => {
  let service: ScraperService;

  let browserMock: any;
  let pageMock: any;

  beforeEach(async () => {
    pageMock = {
      goto: jest.fn(),
      evaluate: jest.fn().mockResolvedValue({
        title: 'Test',
        description: 'Test Desc',
        headings: [],
      }),
      setRequestInterception: jest.fn(),
      on: jest.fn(),
    };
    browserMock = {
      newPage: jest.fn().mockResolvedValue(pageMock),
      close: jest.fn(),
    };
    (puppeteer.launch as unknown as jest.Mock).mockResolvedValue(browserMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [ScraperService],
    }).compile();

    service = module.get<ScraperService>(ScraperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw error for local/private IPs', async () => {
    await expect(
      service.scrapeCompany('http://localhost:3000'),
    ).rejects.toThrow(/restricted|private|invalid/i);
  });

  it('should throw error for private IP 127.0.0.1', async () => {
    await expect(service.scrapeCompany('http://127.0.0.1')).rejects.toThrow(
      /restricted|private|invalid/i,
    );
  });
});
