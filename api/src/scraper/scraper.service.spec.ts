import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import { BadRequestException } from '@nestjs/common';

// Mock puppeteer
jest.mock('puppeteer', () => ({
  launch: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      goto: jest.fn(),
      evaluate: jest.fn().mockResolvedValue({
        title: 'Test',
        description: 'Test',
        headings: [],
      }),
    }),
    close: jest.fn(),
  }),
}));

// Mock dns/promises
jest.mock('dns/promises', () => ({
  lookup: jest.fn(),
}));

import { lookup } from 'dns/promises';

describe('ScraperService', () => {
  let service: ScraperService;

  beforeEach(async () => {
    jest.clearAllMocks();

    (lookup as jest.Mock).mockImplementation(async (hostname) => {
      if (hostname === 'google.com') return { address: '8.8.8.8', family: 4 };
      if (hostname === 'private.com')
        return { address: '192.168.1.1', family: 4 };
      if (hostname === 'local.test')
        return { address: '127.0.0.1', family: 4 };
      return { address: '1.1.1.1', family: 4 };
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [ScraperService],
    }).compile();

    service = module.get<ScraperService>(ScraperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should accept valid public URLs', async () => {
    await expect(
      service.scrapeCompany('https://google.com'),
    ).resolves.not.toThrow();
  });

  it('should reject non-http/https protocols', async () => {
    await expect(service.scrapeCompany('ftp://google.com')).rejects.toThrow(
      BadRequestException,
    );
    await expect(service.scrapeCompany('file:///etc/passwd')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should reject localhost/127.0.0.1 explicitly', async () => {
    await expect(service.scrapeCompany('http://localhost')).rejects.toThrow(
      BadRequestException,
    );
    await expect(service.scrapeCompany('http://127.0.0.1')).rejects.toThrow(
      BadRequestException,
    );
    await expect(service.scrapeCompany('http://[::1]')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should reject private IP addresses via DNS', async () => {
    await expect(service.scrapeCompany('http://private.com')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should reject IPv4-mapped IPv6 private addresses', async () => {
    (lookup as jest.Mock).mockImplementation(async () => ({
      address: '::ffff:192.168.1.1',
      family: 6,
    }));
    await expect(service.scrapeCompany('http://ipv4mapped.com')).rejects.toThrow(
      BadRequestException,
    );
  });
});
