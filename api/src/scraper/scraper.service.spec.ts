/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import { BadRequestException } from '@nestjs/common';
import * as dns from 'dns/promises';

// Mock dns/promises
jest.mock('dns/promises');

const mockLookup: any = dns.lookup;

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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUrl', () => {
    it('should allow valid public URLs', async () => {
      mockLookup.mockResolvedValue({ address: '8.8.8.8' });
      await expect(
        service.validateUrl('https://google.com'),
      ).resolves.not.toThrow();
    });

    it('should reject invalid URL format', async () => {
      await expect(service.validateUrl('not-a-url')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should reject non-http/https protocols', async () => {
      await expect(service.validateUrl('ftp://example.com')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.validateUrl('file:///etc/passwd')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should reject localhost (IPv4)', async () => {
      mockLookup.mockResolvedValue({ address: '127.0.0.1' });
      await expect(service.validateUrl('http://localhost')).rejects.toThrow(
        'Access to private/internal network is forbidden',
      );
    });

    it('should reject localhost (IPv6)', async () => {
      mockLookup.mockResolvedValue({ address: '::1' });
      await expect(service.validateUrl('http://localhost')).rejects.toThrow(
        'Access to private/internal network is forbidden',
      );
    });

    it('should reject private IP 10.x.x.x', async () => {
      mockLookup.mockResolvedValue({ address: '10.0.0.5' });
      await expect(service.validateUrl('http://10.0.0.5')).rejects.toThrow(
        'Access to private/internal network is forbidden',
      );
    });

    it('should reject private IP 192.168.x.x', async () => {
      mockLookup.mockResolvedValue({ address: '192.168.1.1' });
      await expect(service.validateUrl('http://192.168.1.1')).rejects.toThrow(
        'Access to private/internal network is forbidden',
      );
    });

    it('should reject private IP 172.16.x.x', async () => {
      mockLookup.mockResolvedValue({ address: '172.16.0.1' });
      await expect(service.validateUrl('http://172.16.0.1')).rejects.toThrow(
        'Access to private/internal network is forbidden',
      );
    });

    it('should reject AWS metadata IP', async () => {
      mockLookup.mockResolvedValue({
        address: '169.254.169.254',
      });
      await expect(
        service.validateUrl('http://169.254.169.254'),
      ).rejects.toThrow('Access to private/internal network is forbidden');
    });

    it('should reject 0.0.0.0', async () => {
      mockLookup.mockResolvedValue({ address: '0.0.0.0' });
      await expect(service.validateUrl('http://0.0.0.0')).rejects.toThrow(
        'Access to private/internal network is forbidden',
      );
    });

    it('should handle DNS resolution failure', async () => {
      mockLookup.mockRejectedValue(new Error('ENOTFOUND'));
      await expect(
        service.validateUrl('http://non-existent-domain.com'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
