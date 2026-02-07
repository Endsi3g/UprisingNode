/* eslint-disable @typescript-eslint/unbound-method */
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
    create: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
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
    it('should calculate balance correctly using aggregate', async () => {
      const userId = 'user-1';

      // Mock aggregate responses
      (prisma.transaction.aggregate as jest.Mock)
        .mockResolvedValueOnce({ _sum: { amount: 100 } }) // Commission PAID
        .mockResolvedValueOnce({ _sum: { amount: 50 } }); // Withdrawal Not Cancelled

      const balance = await service.getBalance(userId);

      // Expected: 100 - 50 = 50
      expect(balance).toBe(50);

      expect(prisma.transaction.aggregate).toHaveBeenCalledTimes(2);
      expect(prisma.transaction.aggregate).toHaveBeenCalledWith({
        _sum: { amount: true },
        where: {
          userId,
          type: 'COMMISSION',
          status: 'PAID',
        },
      });
      expect(prisma.transaction.aggregate).toHaveBeenCalledWith({
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
