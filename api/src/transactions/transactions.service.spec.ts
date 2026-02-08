/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TransactionsService', () => {
  let service: TransactionsService;

  const mockPrismaService = {
    transaction: {
      findMany: jest.fn(),
      aggregate: jest.fn(),
    },
  };

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
    it('should calculate balance correctly using aggregations', async () => {
      const userId = 'user1';

      // Mock aggregations
      // First call is for commissions
      mockPrismaService.transaction.aggregate.mockResolvedValueOnce({
        _sum: { amount: 100 },
      });
      // Second call is for withdrawals
      mockPrismaService.transaction.aggregate.mockResolvedValueOnce({
        _sum: { amount: 50 },
      });

      const balance = await service.getBalance(userId);

      // 100 - 50 = 50
      expect(balance).toBe(50);

      // Verify calls
      expect(mockPrismaService.transaction.aggregate).toHaveBeenCalledTimes(2);

      // Verify first call (commissions)
      expect(mockPrismaService.transaction.aggregate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userId,
            type: 'COMMISSION',
            status: 'PAID',
          },
        }),
      );

      // Verify second call (withdrawals)
      expect(mockPrismaService.transaction.aggregate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userId,
            type: 'WITHDRAWAL',
            status: { not: 'CANCELLED' },
          },
        }),
      );
    });

    it('should handle zero transactions correctly', async () => {
      const userId = 'user1';

      // Mock empty results (null sum)
      mockPrismaService.transaction.aggregate.mockResolvedValue({
        _sum: { amount: null },
      });

      const balance = await service.getBalance(userId);

      expect(balance).toBe(0);
    });
  });
});
