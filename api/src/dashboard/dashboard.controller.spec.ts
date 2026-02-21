/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { TransactionsService } from '../transactions/transactions.service';
import { LeadsService } from '../leads/leads.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DashboardController', () => {
  let controller: DashboardController;
  let leadsService: LeadsService;
  let transactionsService: TransactionsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            getTotalEarnings: jest.fn().mockResolvedValue(1000),
          },
        },
        {
          provide: LeadsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            getPotentialGains: jest.fn(),
            getActivePipeline: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn().mockResolvedValue({
                id: 'user-1',
                role: 'PARTNER',
                emailVerified: true,
              }),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    leadsService = module.get<LeadsService>(LeadsService);
    transactionsService = module.get<TransactionsService>(TransactionsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getStats', () => {
    it('should use optimized service methods', async () => {
      const mockActivePipeline = [
        {
          id: '1',
          status: 'ANALYSIS',
          score: 10,
          companyName: 'Company A',
          createdAt: new Date('2023-01-01'),
        },
        {
          id: '2',
          status: 'NEGOTIATION',
          score: 20,
          companyName: 'Company B',
          createdAt: new Date('2023-01-02'),
        },
      ];

      (leadsService.getPotentialGains as jest.Mock).mockResolvedValue(350);
      (leadsService.getActivePipeline as jest.Mock).mockResolvedValue(mockActivePipeline);

      const req = { user: { userId: 'user-1' } };

      const result = await controller.getStats(req as any);

      expect(leadsService.getPotentialGains).toHaveBeenCalledWith('user-1');
      expect(leadsService.getActivePipeline).toHaveBeenCalledWith('user-1');

      expect(result.potentialGains).toBe(350);
      expect(result.activePipeline).toHaveLength(2);
      expect(result.activePipeline[0].company).toBe('Company A');
    });
  });
});
