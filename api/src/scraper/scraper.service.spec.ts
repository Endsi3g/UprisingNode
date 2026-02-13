/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import * as dns from 'dns/promises';

// Mock puppeteer
jest.mock('puppeteer', () => ({
  launch: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      goto: jest.fn(),
      evaluate: jest.fn().mockResolvedValue({
        title: 'Test',
        description: 'Test Desc',
        headings: [],
      }),
      close: jest.fn(),
    }),
    close: jest.fn(),
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow valid public URLs', async () => {
    (dns.lookup as jest.Mock).mockResolvedValue({ address: '8.8.8.8' }); // Google DNS
    await expect(
      service.scrapeCompany('https://google.com'),
    ).resolves.not.toThrow();
  });

  it('should block file:// protocol', async () => {
    await expect(service.scrapeCompany('file:///etc/passwd')).rejects.toThrow();
  });

  it('should block localhost', async () => {
    (dns.lookup as jest.Mock).mockResolvedValue({ address: '127.0.0.1' });
    await expect(
      service.scrapeCompany('http://localhost:3000'),
    ).rejects.toThrow();
  });

  it('should block private IPv4 127.0.0.1', async () => {
    (dns.lookup as jest.Mock).mockResolvedValue({ address: '127.0.0.1' });
    await expect(service.scrapeCompany('http://127.0.0.1')).rejects.toThrow();
  });

  it('should block private IPv4 192.168.1.1', async () => {
    (dns.lookup as jest.Mock).mockResolvedValue({ address: '192.168.1.1' });
    await expect(service.scrapeCompany('http://192.168.1.1')).rejects.toThrow();
  });

  it('should block private IPv4 10.0.0.1', async () => {
    (dns.lookup as jest.Mock).mockResolvedValue({ address: '10.0.0.1' });
    await expect(service.scrapeCompany('http://10.0.0.1')).rejects.toThrow();
  });

  it('should block link-local IPv4 169.254.169.254', async () => {
    (dns.lookup as jest.Mock).mockResolvedValue({ address: '169.254.169.254' });
    await expect(
      service.scrapeCompany('http://169.254.169.254/latest/meta-data/'),
    ).rejects.toThrow();
  });

  it('should block IPv6 loopback ::1', async () => {
    (dns.lookup as jest.Mock).mockResolvedValue({ address: '::1' });
    await expect(service.scrapeCompany('http://[::1]')).rejects.toThrow();
  });
});
