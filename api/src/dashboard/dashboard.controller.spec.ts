/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { TransactionsService } from '../transactions/transactions.service';
import { LeadsService } from '../leads/leads.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('DashboardController', () => {
  let controller: DashboardController;
  let transactionsService: TransactionsService;

  const mockTransactionsService = {
    getTotalEarnings: jest.fn(),
    getPendingEarnings: jest.fn(),
    getMonthlyEarnings: jest.fn(),
    findAll: jest.fn(),
  };

  const mockLeadsService = {
    findAll: jest.fn(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        { provide: TransactionsService, useValue: mockTransactionsService },
        { provide: LeadsService, useValue: mockLeadsService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (_context: ExecutionContext) => true,
      })
      .compile();

    controller = module.get<DashboardController>(DashboardController);
    transactionsService = module.get<TransactionsService>(TransactionsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCommissions', () => {
    it('should call ONLY findAll and calculate stats in memory', async () => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Mock return values
      mockTransactionsService.findAll.mockResolvedValue([
        {
          id: '1',
          type: 'COMMISSION',
          status: 'PAID',
          amount: 1000,
          createdAt: new Date(), // Today
          description: 'Deal 1',
        },
        {
          id: '2',
          type: 'COMMISSION',
          status: 'PENDING',
          amount: 200,
          createdAt: new Date(),
          description: 'Deal 2',
        },
        {
          id: '3',
          type: 'WITHDRAWAL', // Should be ignored
          status: 'PAID',
          amount: 500,
          createdAt: new Date(),
          description: 'Withdrawal',
        },
        {
          id: '4',
          type: 'COMMISSION',
          status: 'PAID',
          amount: 500,
          createdAt: new Date(startOfMonth.getTime() - 86400000), // Last month (approx)
          description: 'Old Deal',
        },
      ]);

      const req = {
        user: { userId: 'user-1', email: 'test@example.com', role: 'USER' },
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = await controller.getCommissions(req as any);

      expect(result).toBeDefined();

      // Verify DB calls
      expect(transactionsService.findAll).toHaveBeenCalledWith('user-1');
      expect(transactionsService.getTotalEarnings).not.toHaveBeenCalled();
      expect(transactionsService.getPendingEarnings).not.toHaveBeenCalled();
      expect(transactionsService.getMonthlyEarnings).not.toHaveBeenCalled();

      // Verify calculations
      // Total Paid Commissions: 1000 + 500 = 1500
      expect(result.totalEarnings).toBe(1500);

      // Pending Earnings: 200
      expect(result.pendingEarnings).toBe(200);

      // Monthly Earnings: Only Deal 1 (1000). Deal 4 is old.
      expect(result.thisMonth).toBe(1000);

      // Avg Per Deal: 1500 / 2 = 750
      expect(result.avgPerDeal).toBe(750);
    });
  });
});
