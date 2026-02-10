/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: PrismaService,
          useValue: {
            transaction: {
              findMany: jest.fn(),
              aggregate: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBalance', () => {
    const userId = 'user-1';

    it('should calculate balance correctly using aggregate (optimized logic)', async () => {
      // Mock aggregate calls
      // 1st call: Paid Commissions
      // 2nd call: Withdrawals (not CANCELLED)
      const aggregateMock = prisma.transaction.aggregate as jest.Mock;
      aggregateMock
        .mockResolvedValueOnce({ _sum: { amount: 100 } })
        .mockResolvedValueOnce({ _sum: { amount: 50 } });

      const balance = await service.getBalance(userId);

      expect(balance).toBe(50); // 100 - 50 = 50

      expect(aggregateMock).toHaveBeenCalledTimes(2);

      // Verify first call (Commissions)
      const calls = aggregateMock.mock.calls;
      expect(calls).toHaveLength(2);

      const commissionCall = calls.find(
        (c: any) => c[0].where.type === 'COMMISSION',
      );
      const withdrawalCall = calls.find(
        (c: any) => c[0].where.type === 'WITHDRAWAL',
      );

      expect(commissionCall[0]).toEqual({
        _sum: { amount: true },
        where: {
          userId,
          type: 'COMMISSION',
          status: 'PAID',
        },
      });

      expect(withdrawalCall[0]).toEqual({
        _sum: { amount: true },
        where: {
          userId,
          type: 'WITHDRAWAL',
          status: { not: 'CANCELLED' },
        },
      });
    });

    it('should handle null sums (no transactions)', async () => {
      const aggregateMock = prisma.transaction.aggregate as jest.Mock;
      aggregateMock.mockResolvedValue({ _sum: { amount: null } });

      const balance = await service.getBalance(userId);

      expect(balance).toBe(0);
    });
  });
});
