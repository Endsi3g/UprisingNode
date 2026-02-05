/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  transaction: {
    findMany: jest.fn(),
    create: jest.fn(),
    aggregate: jest.fn(),
  },
};

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBalance', () => {
    it('should calculate balance correctly using database aggregation', async () => {
      const userId = 'user-1';

      // Mock aggregate calls
      // 1. Commissions (COMMISSION + PAID)
      // 2. Withdrawals (WITHDRAWAL + !CANCELLED)
      prisma.transaction.aggregate
        .mockResolvedValueOnce({ _sum: { amount: 100 } }) // Commissions: 100
        .mockResolvedValueOnce({ _sum: { amount: 50 } }); // Withdrawals: 50

      const balance = await service.getBalance(userId);

      // Calculation: 100 - 50 = 50
      expect(balance).toBe(50);

      // Verify aggregate was called correctly
      expect(prisma.transaction.aggregate).toHaveBeenCalledTimes(2);

      // Check first call (Commissions)
      expect(prisma.transaction.aggregate).toHaveBeenCalledWith({
        _sum: { amount: true },
        where: { userId, type: 'COMMISSION', status: 'PAID' },
      });

      // Check second call (Withdrawals)
      expect(prisma.transaction.aggregate).toHaveBeenCalledWith({
        _sum: { amount: true },
        where: { userId, type: 'WITHDRAWAL', status: { not: 'CANCELLED' } },
      });
    });

    it('should handle null sums (empty transactions)', async () => {
      const userId = 'user-2';

      prisma.transaction.aggregate
        .mockResolvedValueOnce({ _sum: { amount: null } })
        .mockResolvedValueOnce({ _sum: { amount: null } });

      const balance = await service.getBalance(userId);

      expect(balance).toBe(0);
    });
  });
});
