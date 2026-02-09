/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma/prisma.service';

// Define a type for the mock that includes Jest mock methods
type MockPrismaService = {
  transaction: {
    findMany: jest.Mock;
    aggregate: jest.Mock;
  };
};

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prisma: MockPrismaService;

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
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    // Cast the injected service to our mock type for testing
    prisma = module.get<PrismaService>(
      PrismaService,
    ) as unknown as MockPrismaService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBalance', () => {
    it('should calculate balance correctly using aggregation', async () => {
      const userId = 'user1';

      // Mock for commissions: sum of PAID COMMISSION = 100
      prisma.transaction.aggregate.mockResolvedValueOnce({
        _sum: { amount: 100 },
      });
      // Mock for withdrawals: sum of NON-CANCELLED WITHDRAWAL = 50 (30 + 20)
      prisma.transaction.aggregate.mockResolvedValueOnce({
        _sum: { amount: 50 },
      });

      const balance = await service.getBalance(userId);
      // 100 (Comm) - 50 (Withdrawals) = 50
      expect(balance).toBe(50);

      expect(prisma.transaction.aggregate).toHaveBeenCalledTimes(2);
      // Verify calls arguments
      expect(prisma.transaction.aggregate).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          where: expect.objectContaining({
            userId,
            type: 'COMMISSION',
            status: 'PAID',
          }),
        }),
      );
      expect(prisma.transaction.aggregate).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          where: expect.objectContaining({
            userId,
            type: 'WITHDRAWAL',
            status: { not: 'CANCELLED' },
          }),
        }),
      );
    });
  });
});
