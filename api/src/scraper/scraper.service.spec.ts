/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/require-await */
import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import * as dns from 'dns/promises';

// Mock puppeteer
jest.mock('puppeteer', () => ({
  launch: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      goto: jest.fn().mockResolvedValue(null),
      evaluate: jest.fn().mockResolvedValue({}),
      close: jest.fn().mockResolvedValue(null),
      setRequestInterception: jest.fn().mockResolvedValue(null),
      on: jest.fn(),
    }),
    close: jest.fn().mockResolvedValue(null),
  }),
}));

// Mock dns
jest.mock('dns/promises');

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

  describe('validateUrl', () => {
    const validateUrl = async (url: string) => {
      // Access private method
      return (service as any).validateUrl(url);
    };

    it('should allow public IPs', async () => {
      (dns.lookup as any as jest.Mock).mockResolvedValue({
        address: '8.8.8.8',
      });
      await expect(validateUrl('https://google.com')).resolves.not.toThrow();
    });

    it('should block private IP 127.0.0.1', async () => {
      (dns.lookup as any as jest.Mock).mockResolvedValue({
        address: '127.0.0.1',
      });
      await expect(validateUrl('http://localhost')).rejects.toThrow();
    });

    it('should block private IP 0.0.0.0', async () => {
      (dns.lookup as any as jest.Mock).mockResolvedValue({
        address: '0.0.0.0',
      });
      await expect(validateUrl('http://0.0.0.0')).rejects.toThrow();
    });

    it('should block private IP 10.0.0.1', async () => {
      (dns.lookup as any as jest.Mock).mockResolvedValue({
        address: '10.0.0.1',
      });
      await expect(validateUrl('http://10.0.0.1')).rejects.toThrow();
    });

    it('should block private IP 192.168.1.1', async () => {
      (dns.lookup as any as jest.Mock).mockResolvedValue({
        address: '192.168.1.1',
      });
      await expect(validateUrl('http://192.168.1.1')).rejects.toThrow();
    });

    it('should block private IP 169.254.169.254', async () => {
      (dns.lookup as any as jest.Mock).mockResolvedValue({
        address: '169.254.169.254',
      });
      await expect(validateUrl('http://169.254.169.254')).rejects.toThrow();
    });

    it('should block private IPv6 ::1', async () => {
      (dns.lookup as any as jest.Mock).mockResolvedValue({ address: '::1' });
      await expect(validateUrl('http://[::1]')).rejects.toThrow();
    });

    it('should block private IPv6 ::ffff:127.0.0.1 (IPv4-mapped)', async () => {
      (dns.lookup as any as jest.Mock).mockResolvedValue({
        address: '::ffff:127.0.0.1',
      });
      await expect(validateUrl('http://[::ffff:127.0.0.1]')).rejects.toThrow();
    });

    it('should block invalid protocol file://', async () => {
      // No DNS lookup needed for invalid protocol check usually, but mock it just in case logic order varies
      (dns.lookup as any as jest.Mock).mockResolvedValue({
        address: '127.0.0.1',
      });
      await expect(validateUrl('file:///etc/passwd')).rejects.toThrow();
    });

    it('should block invalid protocol ftp://', async () => {
      await expect(validateUrl('ftp://example.com')).rejects.toThrow();
    });
  });
});
