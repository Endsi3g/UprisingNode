/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { PrismaService } from '../prisma/prisma.service';

describe('LeadsService', () => {
  let service: LeadsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        {
          provide: PrismaService,
          useValue: {
            lead: {
              aggregate: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPotentialGains', () => {
    it('should aggregate scores for specific statuses', async () => {
      (prismaService.lead.aggregate as jest.Mock).mockResolvedValue({
        _sum: { score: 50 },
      });

      const result = await service.getPotentialGains('user-1');

      expect(prismaService.lead.aggregate).toHaveBeenCalledWith({
        where: {
          ownerId: 'user-1',
          status: { in: ['ANALYSIS', 'NEGOTIATION', 'PROSPECT'] },
        },
        _sum: { score: true },
      });
      expect(result).toBe(500); // 50 * 10
    });

    it('should return 0 if no scores found', async () => {
        (prismaService.lead.aggregate as jest.Mock).mockResolvedValue({
          _sum: { score: null },
        });

        const result = await service.getPotentialGains('user-1');

        expect(result).toBe(0);
      });
  });

  describe('getActivePipeline', () => {
    it('should find top 5 leads excluding closed/lost', async () => {
      const mockLeads = [{ id: '1' }, { id: '2' }];
      (prismaService.lead.findMany as jest.Mock).mockResolvedValue(mockLeads);

      const result = await service.getActivePipeline('user-1');

      expect(prismaService.lead.findMany).toHaveBeenCalledWith({
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
