import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  transaction: {
    findMany: jest.fn(),
    groupBy: jest.fn(),
    create: jest.fn(),
    aggregate: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
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
    it('should calculate balance correctly with mixed transactions', async () => {
      const userId = 'user-1';

      // Mocking the groupBy result
      const aggregations = [
        { type: 'COMMISSION', status: 'PAID', _sum: { amount: 100 } },
        { type: 'COMMISSION', status: 'PENDING', _sum: { amount: 50 } }, // Should be ignored
        { type: 'WITHDRAWAL', status: 'PENDING', _sum: { amount: 30 } }, // Should be subtracted
        { type: 'WITHDRAWAL', status: 'PAID', _sum: { amount: 20 } }, // Should be subtracted
      ];

      mockPrismaService.transaction.groupBy.mockResolvedValue(aggregations);

      const balance = await service.getBalance(userId);

      // Calculation:
      // +100 (Comm Paid)
      // +0 (Comm Pending)
      // -30 (Withdrawal Pending)
      // -20 (Withdrawal Paid)
      // Total: 50
      expect(balance).toBe(50);
      expect(prisma.transaction.groupBy).toHaveBeenCalledWith({
        by: ['type', 'status'],
        where: {
          userId,
          status: { not: 'CANCELLED' },
        },
        _sum: { amount: true },
      });
    });

    it('should return 0 if no transactions found', async () => {
      mockPrismaService.transaction.groupBy.mockResolvedValue([]);
      const balance = await service.getBalance('user-1');
      expect(balance).toBe(0);
    });
  });
});
