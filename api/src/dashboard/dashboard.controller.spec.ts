/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { TransactionsService } from '../transactions/transactions.service';
import { LeadsService } from '../leads/leads.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DashboardController', () => {
  let controller: DashboardController;

  const mockLeadsService = {
    getActivePipeline: jest.fn(),
    getPotentialGains: jest.fn(),
  };

  const mockTransactionsService = {
    getTotalEarnings: jest.fn().mockResolvedValue(1000),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn().mockResolvedValue({
        role: 'PARTNER',
        emailVerified: true,
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
        {
          provide: LeadsService,
          useValue: mockLeadsService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getStats', () => {
    it('should return dashboard stats using optimized service methods', async () => {
      const mockActivePipeline = [
        {
          id: 'lead1',
          companyName: 'Company A',
          status: 'PROSPECT',
          createdAt: new Date('2023-01-01'),
        },
      ];
      const mockPotentialGains = 500;

      mockLeadsService.getActivePipeline.mockResolvedValue(mockActivePipeline);
      mockLeadsService.getPotentialGains.mockResolvedValue(mockPotentialGains);

      const req = { user: { userId: 'user1' } };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = await controller.getStats(req as any);

      expect(mockLeadsService.getActivePipeline).toHaveBeenCalledWith('user1');
      expect(mockLeadsService.getPotentialGains).toHaveBeenCalledWith('user1');
      expect(result.potentialGains).toBe(mockPotentialGains);
      expect(result.activePipeline).toHaveLength(1);
      expect(result.activePipeline[0].company).toBe('Company A');
    });
  });
});
