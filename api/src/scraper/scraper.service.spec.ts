/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import { BadRequestException } from '@nestjs/common';
import * as dns from 'dns/promises';

// Mock puppeteer
jest.mock('puppeteer', () => ({
  launch: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      goto: jest.fn().mockResolvedValue({}),
      evaluate: jest.fn().mockResolvedValue({}),
      setRequestInterception: jest.fn().mockResolvedValue({}),
      on: jest.fn(),
      close: jest.fn().mockResolvedValue({}),
    }),
    close: jest.fn().mockResolvedValue({}),
  }),
}));

// Mock dns
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('scrapeCompany', () => {
    it('should throw BadRequestException for localhost URL', async () => {
      // Mock dns lookup to return localhost IP
      (dns.lookup as jest.Mock).mockResolvedValue({ address: '127.0.0.1' });

      await expect(service.scrapeCompany('http://localhost')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for private IP URL', async () => {
      // Mock dns lookup to return a private IP
      (dns.lookup as jest.Mock).mockResolvedValue({ address: '192.168.1.1' });

      await expect(service.scrapeCompany('http://192.168.1.1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should allow valid public URL', async () => {
      // Mock dns lookup to return a public IP
      (dns.lookup as jest.Mock).mockResolvedValue({ address: '8.8.8.8' });

      await expect(
        service.scrapeCompany('https://google.com'),
      ).resolves.not.toThrow();
    });
  });
});
