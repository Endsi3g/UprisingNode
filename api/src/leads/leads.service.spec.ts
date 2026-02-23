/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { PrismaService } from '../prisma/prisma.service';

describe('LeadsService', () => {
  let service: LeadsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    lead: {
      aggregate: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
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
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPotentialGains', () => {
    it('should calculate potential gains correctly', async () => {
      const userId = 'user-1';
      // Mock aggregate result
      (prisma.lead.aggregate as jest.Mock).mockResolvedValue({
        _sum: { score: 50 },
      });

      const result = await service.getPotentialGains(userId);

      expect(prisma.lead.aggregate).toHaveBeenCalledWith({
        _sum: { score: true },
        where: {
          ownerId: userId,
          status: { in: ['ANALYSIS', 'NEGOTIATION', 'PROSPECT'] },
        },
      });
      // Score 50 * 10 = 500
      expect(result).toBe(500);
    });

    it('should return 0 if score sum is null', async () => {
      const userId = 'user-1';
      (prisma.lead.aggregate as jest.Mock).mockResolvedValue({
        _sum: { score: null },
      });

      const result = await service.getPotentialGains(userId);
      expect(result).toBe(0);
    });
  });

  describe('getActivePipeline', () => {
    it('should return active pipeline leads', async () => {
      const userId = 'user-1';
      const mockLeads = [
        { id: '1', status: 'ANALYSIS', createdAt: new Date() },
        { id: '2', status: 'PROSPECT', createdAt: new Date() },
      ];
      (prisma.lead.findMany as jest.Mock).mockResolvedValue(mockLeads);

      const result = await service.getActivePipeline(userId);

      expect(prisma.lead.findMany).toHaveBeenCalledWith({
        where: {
          ownerId: userId,
          status: { notIn: ['CLOSED', 'LOST'] },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
      expect(result).toEqual(mockLeads);
    });
  });
});
