/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { TransactionsService } from '../transactions/transactions.service';
import { LeadsService } from '../leads/leads.service';
import { PrismaService } from '../prisma/prisma.service';

const mockTransactionsService = {
  getTotalEarnings: jest.fn(),
  getPendingEarnings: jest.fn(),
  getMonthlyEarnings: jest.fn(),
  findAll: jest.fn(),
};

const mockLeadsService = {
  findAll: jest.fn(),
  getPotentialGains: jest.fn(),
  getActivePipeline: jest.fn(),
};

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
  },
};

describe('DashboardController', () => {
  let controller: DashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        { provide: TransactionsService, useValue: mockTransactionsService },
        { provide: LeadsService, useValue: mockLeadsService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getStats', () => {
    it('should use optimized methods to fetch stats', async () => {
      /* eslint-disable @typescript-eslint/no-unsafe-assignment */
      const mockReq = { user: { userId: 'user-1' } } as any;

      mockTransactionsService.getTotalEarnings.mockResolvedValue(1000);
      mockPrismaService.user.findUnique.mockResolvedValue({
        role: 'PARTNER',
        emailVerified: true,
      });

      // Mock new methods
      mockLeadsService.getPotentialGains.mockResolvedValue(500);
      mockLeadsService.getActivePipeline.mockResolvedValue([
        {
          id: '1',
          companyName: 'A',
          status: 'ANALYSIS',
          createdAt: new Date(),
        },
      ]);

      // Mock findAll just in case (though we expect it not to be called)
      mockLeadsService.findAll.mockResolvedValue([]);

      const result = await controller.getStats(mockReq);

      expect(mockLeadsService.getPotentialGains).toHaveBeenCalledWith('user-1');
      expect(mockLeadsService.getActivePipeline).toHaveBeenCalledWith('user-1');

      // Verify result structure
      expect(result).toEqual({
        accumulatedGains: 1000,
        potentialGains: 500,
        activePipeline: expect.any(Array),
        accountStatus: { active: true, verified: true },
      });

      // Ensure active pipeline is mapped correctly
      expect(result.activePipeline).toHaveLength(1);
      expect(result.activePipeline[0].company).toBe('A');
    });
  });
});
