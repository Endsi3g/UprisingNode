/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  lead: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    aggregate: jest.fn(),
    groupBy: jest.fn(),
  },
};

describe('LeadsService', () => {
  let service: LeadsService;
  let prisma: typeof mockPrismaService;

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
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPotentialGains', () => {
    it('should calculate potential gains correctly', async () => {
      prisma.lead.aggregate.mockResolvedValue({ _sum: { score: 50 } });
      const result = await service.getPotentialGains('user-1');
      expect(result).toBe(500);
      expect(prisma.lead.aggregate).toHaveBeenCalledWith({
        _sum: { score: true },
        where: {
          ownerId: 'user-1',
          status: { in: ['ANALYSIS', 'NEGOTIATION', 'PROSPECT'] },
        },
      });
    });

    it('should return 0 if no scores', async () => {
      prisma.lead.aggregate.mockResolvedValue({ _sum: { score: null } });
      const result = await service.getPotentialGains('user-1');
      expect(result).toBe(0);
    });
  });

  describe('getActivePipeline', () => {
    it('should return top 5 active leads', async () => {
      const mockLeads = [{ id: '1' }, { id: '2' }];
      prisma.lead.findMany.mockResolvedValue(mockLeads);
      const result = await service.getActivePipeline('user-1');
      expect(result).toEqual(mockLeads);
      expect(prisma.lead.findMany).toHaveBeenCalledWith({
        where: {
          ownerId: 'user-1',
          status: { notIn: ['CLOSED', 'LOST'] },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
    });
  });

  describe('getStats', () => {
    it('should calculate stats correctly', async () => {
      prisma.lead.groupBy.mockResolvedValue([
        { status: 'PROSPECT', _count: { status: 5 } },
        { status: 'ANALYSIS', _count: { status: 3 } },
        { status: 'CLOSED', _count: { status: 2 } },
        { status: 'LOST', _count: { status: 1 } },
      ]);
      prisma.lead.aggregate.mockResolvedValue({ _sum: { score: 100 } });

      const result = await service.getStats('user-1');

      expect(result).toEqual({
        activeLeads: 8, // 5 + 3
        inAudit: 3,
        signedDeals: 2,
        currentBalance: 1000,
      });
    });
  });
});
