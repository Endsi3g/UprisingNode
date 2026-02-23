/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

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

  const mockTransactionsService = {
    getTotalEarnings: jest.fn(),
    getPendingEarnings: jest.fn(),
    getMonthlyEarnings: jest.fn(),
    findAll: jest.fn(),
  };

  const mockLeadsService = {
    getPotentialGains: jest.fn(),
    getActivePipeline: jest.fn(),
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
    transactionsService = module.get<TransactionsService>(TransactionsService);
    leadsService = module.get<LeadsService>(LeadsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getStats', () => {
    it('should return dashboard stats', async () => {
      const userId = 'user-1';
      const req = {
        user: { userId, email: 'test@example.com', role: 'PARTNER' },
      } as any;

      const mockUser = {
        id: userId,
        role: 'PARTNER',
        emailVerified: true,
      };

      const mockActivePipeline = [
        {
          id: 'lead-1',
          companyName: 'Company A',
          status: 'ANALYSIS',
          createdAt: new Date('2023-01-01'),
        },
      ];

      (transactionsService.getTotalEarnings as jest.Mock).mockResolvedValue(
        1000,
      );
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (leadsService.getPotentialGains as jest.Mock).mockResolvedValue(500);
      (leadsService.getActivePipeline as jest.Mock).mockResolvedValue(
        mockActivePipeline,
      );

      const result = await controller.getStats(req);

      expect(transactionsService.getTotalEarnings).toHaveBeenCalledWith(userId);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(leadsService.getPotentialGains).toHaveBeenCalledWith(userId);
      expect(leadsService.getActivePipeline).toHaveBeenCalledWith(userId);

      expect(result).toEqual({
        accumulatedGains: 1000,
        potentialGains: 500,
        activePipeline: [
          {
            id: 'lead-1',
            company: 'Company A',
            status: 'analysis',
            submittedAt: new Date('2023-01-01').toISOString(),
            riskScore: 'En attente',
          },
        ],
        accountStatus: {
          active: true,
          verified: true,
        },
      });
    });
  });
});
