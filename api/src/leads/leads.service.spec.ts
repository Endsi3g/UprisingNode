/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  lead: {
    findMany: jest.fn(),
    aggregate: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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
    it('should calculate potential gains using aggregation', async () => {
      /* eslint-disable @typescript-eslint/no-unsafe-call */
      prisma.lead.aggregate.mockResolvedValue({ _sum: { score: 50 } });

      const result = await service.getPotentialGains('user-1');

      expect(prisma.lead.aggregate).toHaveBeenCalledWith({
        _sum: { score: true },
        where: {
          ownerId: 'user-1',
          status: { in: ['ANALYSIS', 'NEGOTIATION', 'PROSPECT'] },
        },
      });
      expect(result).toBe(500); // 50 * 10
    });

    it('should return 0 if no scores found', async () => {
      /* eslint-disable @typescript-eslint/no-unsafe-call */
      prisma.lead.aggregate.mockResolvedValue({ _sum: { score: null } });
      const result = await service.getPotentialGains('user-1');
      expect(result).toBe(0);
    });
  });

  describe('getActivePipeline', () => {
    it('should fetch top 5 active leads', async () => {
      const mockLeads = [{ id: '1' }, { id: '2' }];
      /* eslint-disable @typescript-eslint/no-unsafe-call */
      prisma.lead.findMany.mockResolvedValue(mockLeads);

      const result = await service.getActivePipeline('user-1');

      expect(prisma.lead.findMany).toHaveBeenCalledWith({
        where: {
          ownerId: 'user-1',
          status: { notIn: ['CLOSED', 'LOST'] },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
      expect(result).toEqual(mockLeads);
    });
  });
});
