/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { TransactionsService } from '../transactions/transactions.service';
import { LeadsService } from '../leads/leads.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DashboardController', () => {
  let controller: DashboardController;

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
    }).compile();

    controller = module.get<DashboardController>(DashboardController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getStats', () => {
    it('should return dashboard stats', async () => {
      const userId = 'user-1';
      const mockUser = { id: userId, role: 'PARTNER', emailVerified: true };
      const mockLeads = [
        {
          id: 'l1',
          companyName: 'A Corp',
          status: 'ANALYSIS',
          score: 10,
          createdAt: new Date('2023-01-01'),
        },
        {
          id: 'l2',
          companyName: 'B Corp',
          status: 'CLOSED',
          score: 20,
          createdAt: new Date('2023-01-02'),
        },
      ];

      mockTransactionsService.getTotalEarnings.mockResolvedValue(1000);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockLeadsService.findAll.mockResolvedValue(mockLeads);

      const result = await controller.getStats({ user: { userId } } as any);

      expect(result).toEqual({
        accumulatedGains: 1000,
        potentialGains: 100, // 10 * 10
        activePipeline: [
          {
            id: 'l1',
            company: 'A Corp',
            status: 'analysis',
            submittedAt: new Date('2023-01-01').toISOString(),
            riskScore: 'En attente',
          },
        ],
        accountStatus: { active: true, verified: true },
      });

      expect(mockTransactionsService.getTotalEarnings).toHaveBeenCalledWith(
        userId,
      );
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockLeadsService.findAll).toHaveBeenCalledWith(userId);
    });
  });

  describe('getCommissions', () => {
    it('should return commissions stats', async () => {
      const userId = 'user-1';
      const mockTransactions = [
        {
          id: 't1',
          type: 'COMMISSION',
          status: 'PAID',
          amount: 100,
          createdAt: new Date('2023-01-01'),
          description: 'Deal 1',
        },
        {
          id: 't2',
          type: 'WITHDRAWAL',
          status: 'COMPLETED',
          amount: 50,
          createdAt: new Date('2023-01-02'),
        },
      ];

      mockTransactionsService.getTotalEarnings.mockResolvedValue(500);
      mockTransactionsService.getPendingEarnings.mockResolvedValue(200);
      mockTransactionsService.getMonthlyEarnings.mockResolvedValue(100);
      mockTransactionsService.findAll.mockResolvedValue(mockTransactions);

      const result = await controller.getCommissions({
        user: { userId },
      } as any);

      expect(result).toEqual({
        totalEarnings: 500,
        pendingEarnings: 200,
        thisMonth: 100,
        avgPerDeal: 500 / 1, // 1 paid commission
        history: [
          {
            id: 't1',
            company: 'Deal 1',
            type: 'closing',
            amount: 100,
            date: new Date('2023-01-01').toISOString(),
            status: 'paid',
          },
          {
            id: 't2',
            company: 'Unknown',
            type: 'closing',
            amount: 50,
            date: new Date('2023-01-02').toISOString(),
            status: 'completed',
          },
        ],
      });

      expect(mockTransactionsService.getTotalEarnings).toHaveBeenCalledWith(
        userId,
      );
      expect(mockTransactionsService.getPendingEarnings).toHaveBeenCalledWith(
        userId,
      );
      expect(mockTransactionsService.getMonthlyEarnings).toHaveBeenCalledWith(
        userId,
      );
      expect(mockTransactionsService.findAll).toHaveBeenCalledWith(userId);
    });
  });
});
