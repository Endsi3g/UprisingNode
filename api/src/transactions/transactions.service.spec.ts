/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TransactionsService', () => {
  let service: TransactionsService;

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

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBalance', () => {
    it('should calculate balance correctly using aggregation', async () => {
      const userId = 'user-1';
      // Scenario:
      // +100 Commission PAID
      // +50 Commission PENDING (Ignored)
      // -30 Withdrawal PENDING (Subtracted)
      // -20 Withdrawal PAID (Subtracted)

      const mockGroups = [
        { type: 'COMMISSION', status: 'PAID', _sum: { amount: 100 } },
        { type: 'COMMISSION', status: 'PENDING', _sum: { amount: 50 } },
        { type: 'WITHDRAWAL', status: 'PENDING', _sum: { amount: 30 } },
        { type: 'WITHDRAWAL', status: 'PAID', _sum: { amount: 20 } },
      ];

      mockPrismaService.transaction.groupBy.mockResolvedValue(mockGroups);

      const balance = await service.getBalance(userId);

      // Calculation: 100 - 30 - 20 = 50
      expect(balance).toBe(50);
      expect(mockPrismaService.transaction.groupBy).toHaveBeenCalledWith({
        by: ['type', 'status'],
        where: {
          userId,
          status: { not: 'CANCELLED' },
        },
        _sum: {
          amount: true,
        },
      });
    });
  });
});
