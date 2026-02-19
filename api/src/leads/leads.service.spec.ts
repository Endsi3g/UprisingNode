/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { PrismaService } from '../prisma/prisma.service';

describe('LeadsService', () => {
  let service: LeadsService;

  const mockPrismaService = {
    lead: {
      create: jest.fn(),
      findMany: jest.fn(),
      aggregate: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPotentialGains', () => {
    it('should return calculated gains', async () => {
      mockPrismaService.lead.aggregate.mockResolvedValue({
        _sum: { score: 50 },
      });

      const result = await service.getPotentialGains('user-1');
      expect(result).toBe(500); // 50 * 10
      expect(mockPrismaService.lead.aggregate).toHaveBeenCalledWith({
        _sum: { score: true },
        where: {
          ownerId: 'user-1',
          status: { in: ['ANALYSIS', 'NEGOTIATION', 'PROSPECT'] },
        },
      });
    });

    it('should return 0 if score sum is null', async () => {
      mockPrismaService.lead.aggregate.mockResolvedValue({
        _sum: { score: null },
      });

      const result = await service.getPotentialGains('user-1');
      expect(result).toBe(0);
    });
  });

  describe('getActivePipeline', () => {
    it('should return active pipeline leads', async () => {
      const mockLeads = [
        {
          id: '1',
          companyName: 'Company A',
          status: 'ANALYSIS',
          createdAt: new Date(),
        },
      ];
      mockPrismaService.lead.findMany.mockResolvedValue(mockLeads);

      const result = await service.getActivePipeline('user-1');
      expect(result).toEqual(mockLeads);
      expect(mockPrismaService.lead.findMany).toHaveBeenCalledWith({
        where: {
          ownerId: 'user-1',
          status: { notIn: ['CLOSED', 'LOST'] },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          companyName: true,
          status: true,
          createdAt: true,
        },
      });
    });
  });
});
