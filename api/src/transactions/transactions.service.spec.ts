import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma/prisma.service';

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

const mockPrismaService = {
  transaction: {
    findMany: jest.fn(),
    aggregate: jest.fn(),
    create: jest.fn(),
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
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBalance', () => {
    it('should calculate balance correctly', async () => {
      const userId = 'user1';
      // Scenario:
      // +100 Commission PAID
      // +50 Commission PENDING (ignored)
      // -30 Withdrawal PENDING (subtracted)
      // -10 Withdrawal PAID (subtracted)
      // Withdrawal CANCELLED (should be filtered out by query)

      const transactions = [
        { type: 'COMMISSION', status: 'PAID', amount: 100 },
        { type: 'COMMISSION', status: 'PENDING', amount: 50 },
        { type: 'WITHDRAWAL', status: 'PENDING', amount: 30 },
        { type: 'WITHDRAWAL', status: 'PAID', amount: 10 },
      ];

      // Mock findMany for the legacy implementation
      prisma.transaction.findMany.mockResolvedValue(transactions);

      // Mock aggregate for the optimized implementation
      // Call 1: Commission PAID -> 100
      // Call 2: Withdrawal NOT CANCELLED -> 30 + 10 = 40
      prisma.transaction.aggregate
        .mockResolvedValueOnce({ _sum: { amount: 100 } }) // Commission
        .mockResolvedValueOnce({ _sum: { amount: 40 } }); // Withdrawal

      const balance = await service.getBalance(userId);

      // 100 - 30 - 10 = 60
      expect(balance).toBe(60);
    });
  });
});
