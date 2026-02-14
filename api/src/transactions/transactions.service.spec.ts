import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma/prisma.service';

/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

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
              aggregate: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
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
    it('should calculate balance correctly using aggregation', async () => {
      const userId = 'user-1';

      (prisma.transaction.aggregate as jest.Mock)
        .mockResolvedValueOnce({ _sum: { amount: 100 } }) // Paid Commissions
        .mockResolvedValueOnce({ _sum: { amount: 30 } }); // Active Withdrawals

      const balance = await service.getBalance(userId);

      expect(prisma.transaction.aggregate).toHaveBeenCalledTimes(2);
      expect(prisma.transaction.aggregate).toHaveBeenNthCalledWith(1, {
        _sum: { amount: true },
        where: { userId, type: 'COMMISSION', status: 'PAID' },
      });
      expect(prisma.transaction.aggregate).toHaveBeenNthCalledWith(2, {
        _sum: { amount: true },
        where: { userId, type: 'WITHDRAWAL', status: { not: 'CANCELLED' } },
      });
      expect(balance).toBe(70);
    });

    it('should handle null sums (no transactions)', async () => {
      const userId = 'user-2';

      (prisma.transaction.aggregate as jest.Mock)
        .mockResolvedValueOnce({ _sum: { amount: null } })
        .mockResolvedValueOnce({ _sum: { amount: null } });

      const balance = await service.getBalance(userId);

      expect(balance).toBe(0);
    });
  });
});
