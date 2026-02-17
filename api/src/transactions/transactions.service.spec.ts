/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  transaction: {
    findMany: jest.fn(),
    groupBy: jest.fn(),
  },
};

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prisma: PrismaService;

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
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBalance', () => {
    it('should calculate balance correctly (optimized)', async () => {
      // Mock data representing what groupBy would return
      const mockAggregations = [
        { type: 'COMMISSION', status: 'PAID', _sum: { amount: 100 } },
        { type: 'COMMISSION', status: 'PENDING', _sum: { amount: 50 } },
        { type: 'WITHDRAWAL', status: 'COMPLETED', _sum: { amount: 30 } },
      ];

      (prisma.transaction.groupBy as jest.Mock).mockResolvedValue(
        mockAggregations,
      );

      const balance = await service.getBalance('user1');

      // Verification
      expect(prisma.transaction.groupBy).toHaveBeenCalledWith({
        by: ['type', 'status'],
        where: {
          userId: 'user1',
          status: { not: 'CANCELLED' },
        },
        _sum: {
          amount: true,
        },
      });

      // Logic check:
      // +100 (Comm Paid)
      // +0 (Comm Pending)
      // -30 (Withdrawal Completed)
      // Total = 70
      expect(balance).toBe(70);
    });
  });
});
