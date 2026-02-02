/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { TransactionsService } from '../transactions/transactions.service';
import { LeadsService } from '../leads/leads.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DashboardController', () => {
  let controller: DashboardController;
  let transactionsService: TransactionsService;
  let leadsService: LeadsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            getTotalEarnings: jest.fn(),
            getPendingEarnings: jest.fn(),
            getMonthlyEarnings: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: LeadsService,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    transactionsService = module.get<TransactionsService>(TransactionsService);
    leadsService = module.get<LeadsService>(LeadsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getStats', () => {
    it('should return dashboard stats', async () => {
      const mockUser = {
        userId: 'user1',
        email: 'test@example.com',
        role: 'PARTNER',
      };
      const req = { user: mockUser };

      const mockEarnings = 1000;
      const mockUserData = {
        id: 'user1',
        role: 'PARTNER',
        emailVerified: true,
      };
      const mockLeads = [
        {
          id: 'lead1',
          companyName: 'Company A',
          status: 'ANALYSIS',
          score: 5,
          createdAt: new Date(),
        },
      ];

      jest
        .spyOn(transactionsService, 'getTotalEarnings')
        .mockResolvedValue(mockEarnings);
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(mockUserData as any);
      jest.spyOn(leadsService, 'findAll').mockResolvedValue(mockLeads as any);

      const result = await controller.getStats(req as any);

      expect(result.accumulatedGains).toBe(mockEarnings);
      expect(result.potentialGains).toBe(50); // 5 * 10
      expect(result.activePipeline).toHaveLength(1);
      expect(result.accountStatus.active).toBe(true);

      expect(transactionsService.getTotalEarnings).toHaveBeenCalledWith(
        'user1',
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user1' },
      });
      expect(leadsService.findAll).toHaveBeenCalledWith('user1');
    });
  });

  describe('getCommissions', () => {
    it('should return commission stats', async () => {
      const mockUser = {
        userId: 'user1',
        email: 'test@example.com',
        role: 'PARTNER',
      };
      const req = { user: mockUser };

      const mockTotal = 2000;
      const mockPending = 500;
      const mockMonthly = 100;
      const mockTransactions = [
        {
          id: 'tx1',
          type: 'COMMISSION',
          status: 'PAID',
          amount: 1000,
          createdAt: new Date(),
          description: 'Deal 1',
        },
        {
          id: 'tx2',
          type: 'COMMISSION',
          status: 'PAID',
          amount: 1000,
          createdAt: new Date(),
          description: 'Deal 2',
        },
      ];

      jest
        .spyOn(transactionsService, 'getTotalEarnings')
        .mockResolvedValue(mockTotal);
      jest
        .spyOn(transactionsService, 'getPendingEarnings')
        .mockResolvedValue(mockPending);
      jest
        .spyOn(transactionsService, 'getMonthlyEarnings')
        .mockResolvedValue(mockMonthly);
      jest
        .spyOn(transactionsService, 'findAll')
        .mockResolvedValue(mockTransactions as any);

      const result = await controller.getCommissions(req as any);

      expect(result.totalEarnings).toBe(mockTotal);
      expect(result.pendingEarnings).toBe(mockPending);
      expect(result.thisMonth).toBe(mockMonthly);
      expect(result.avgPerDeal).toBe(1000); // 2000 / 2
      expect(result.history).toHaveLength(2);

      expect(transactionsService.getTotalEarnings).toHaveBeenCalledWith(
        'user1',
      );
      expect(transactionsService.getPendingEarnings).toHaveBeenCalledWith(
        'user1',
      );
      expect(transactionsService.getMonthlyEarnings).toHaveBeenCalledWith(
        'user1',
      );
      expect(transactionsService.findAll).toHaveBeenCalledWith('user1');
    });
  });
});
