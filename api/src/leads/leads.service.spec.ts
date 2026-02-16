import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { PrismaService } from '../prisma/prisma.service';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

const mockPrismaService = {
  lead: {
    findMany: jest.fn(),
    create: jest.fn(),
    aggregate: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('LeadsService', () => {
  let service: LeadsService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prisma: PrismaService;

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
      mockPrismaService.lead.aggregate.mockResolvedValue({
        _sum: { score: 50 },
      });
      const result = await service.getPotentialGains('user-id');
      expect(result).toBe(500);
      expect(mockPrismaService.lead.aggregate).toHaveBeenCalledWith({
        _sum: { score: true },
        where: {
          ownerId: 'user-id',
          status: { in: ['ANALYSIS', 'NEGOTIATION', 'PROSPECT'] },
        },
      });
    });

    it('should return 0 if no score', async () => {
      mockPrismaService.lead.aggregate.mockResolvedValue({
        _sum: { score: null },
      });
      const result = await service.getPotentialGains('user-id');
      expect(result).toBe(0);
    });
  });

  describe('getActivePipeline', () => {
    it('should return top 5 active leads', async () => {
      const mockLeads = [{ id: '1' }, { id: '2' }];
      mockPrismaService.lead.findMany.mockResolvedValue(mockLeads);
      const result = await service.getActivePipeline('user-id');
      expect(result).toEqual(mockLeads);
      expect(mockPrismaService.lead.findMany).toHaveBeenCalledWith({
        where: {
          ownerId: 'user-id',
          status: { notIn: ['CLOSED', 'LOST'] },
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
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
