/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { PrismaService } from '../prisma/prisma.service';

describe('LeadsService', () => {
  let service: LeadsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        {
          provide: PrismaService,
          useValue: {
            lead: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              aggregate: jest.fn(),
            },
          },
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
      (prisma.lead.aggregate as jest.Mock).mockResolvedValue({
        _sum: { score: 150 },
      });

      const result = await service.getPotentialGains(userId);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.lead.aggregate).toHaveBeenCalledWith({
        _sum: { score: true },
        where: {
          ownerId: userId,
          status: { in: ['ANALYSIS', 'NEGOTIATION', 'PROSPECT'] },
        },
      });
      expect(result).toBe(1500); // 150 * 10
    });
  });

  describe('getActivePipeline', () => {
    it('should return top 5 active leads', async () => {
      const userId = 'user-1';
      const mockLeads = [
        { id: '1', companyName: 'A', status: 'ANALYSIS' },
        { id: '2', companyName: 'B', status: 'PROSPECT' },
      ];
      (prisma.lead.findMany as jest.Mock).mockResolvedValue(mockLeads);

      const result = await service.getActivePipeline(userId);

      // eslint-disable-next-line @typescript-eslint/unbound-method
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
