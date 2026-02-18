import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { TransactionsService } from '../transactions/transactions.service';
import { LeadsService } from '../leads/leads.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DashboardController>(DashboardController);
    transactionsService = module.get<TransactionsService>(TransactionsService);
    leadsService = module.get<LeadsService>(LeadsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getStats', () => {
    it('should return aggregated stats', async () => {
      const userId = 'user-123';
      const mockUser = {
        id: userId,
        role: 'PARTNER',
        emailVerified: true,
      };

      const mockLeads = [
        {
          id: 'lead-1',
          companyName: 'Company A',
          status: 'ANALYSIS',
          createdAt: new Date('2023-01-01'),
        },
      ];

      mockTransactionsService.getTotalEarnings.mockResolvedValue(1000);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockLeadsService.getPotentialGains.mockResolvedValue(500);
      mockLeadsService.getActivePipeline.mockResolvedValue(mockLeads);

      const req = {
        user: { userId, email: 'test@example.com', role: 'PARTNER' },
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = await controller.getStats(req as any);

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
            submittedAt: expect.any(String),
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
