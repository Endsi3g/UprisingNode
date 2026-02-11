/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  transaction: {
    findMany: jest.fn(),
    aggregate: jest.fn(),
  },
};

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBalance', () => {
    it('should calculate balance correctly using aggregate', async () => {
      const userId = 'user-1';

      // Mock aggregated results
      // 1. Commission Sum (Paid)
      // 2. Withdrawal Sum (Not Cancelled)
      mockPrismaService.transaction.aggregate
        .mockResolvedValueOnce({ _sum: { amount: 100 } }) // Paid Commissions
        .mockResolvedValueOnce({ _sum: { amount: 50 } }); // Withdrawals (20 + 30)

      const balance = await service.getBalance(userId);

      // Expected: 100 - 50 = 50
      expect(balance).toBe(50);

      expect(mockPrismaService.transaction.aggregate).toHaveBeenCalledTimes(2);

      // Verify calls
      expect(mockPrismaService.transaction.aggregate).toHaveBeenCalledWith({
        _sum: { amount: true },
        where: {
          userId,
          type: 'COMMISSION',
          status: 'PAID',
        },
      });

      expect(mockPrismaService.transaction.aggregate).toHaveBeenCalledWith({
        _sum: { amount: true },
        where: {
          userId,
          type: 'WITHDRAWAL',
          status: { not: 'CANCELLED' },
        },
      });
    });
  });
});
