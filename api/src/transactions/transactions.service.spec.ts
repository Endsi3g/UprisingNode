/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
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

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBalance', () => {
    it('should calculate balance correctly (COMMISSION + PAID)', async () => {
      // Mock implementation to handle different where clauses
      prisma.transaction.aggregate.mockImplementation((args) => {
        const where = args.where;
        if (where.type === 'COMMISSION' && where.status === 'PAID') {
            return Promise.resolve({ _sum: { amount: 100 } });
        }
        if (where.type === 'WITHDRAWAL') {
            return Promise.resolve({ _sum: { amount: 0 } });
        }
        return Promise.resolve({ _sum: { amount: 0 } });
      });

      expect(await service.getBalance('user1')).toBe(100);
    });

    it('should calculate balance correctly (WITHDRAWAL)', async () => {
      prisma.transaction.aggregate.mockImplementation((args) => {
        const where = args.where;
        if (where.type === 'COMMISSION') {
            return Promise.resolve({ _sum: { amount: 0 } });
        }
        if (where.type === 'WITHDRAWAL') {
             // Logic subtracts withdrawal amount.
             // If we want balance to be -50, withdrawals sum should be 50.
            return Promise.resolve({ _sum: { amount: 50 } });
        }
        return Promise.resolve({ _sum: { amount: 0 } });
      });

      expect(await service.getBalance('user1')).toBe(-50);
    });

    it('should calculate mixed balance correctly', async () => {
      prisma.transaction.aggregate.mockImplementation((args) => {
        const where = args.where;
        if (where.type === 'COMMISSION') {
            return Promise.resolve({ _sum: { amount: 100 } });
        }
        if (where.type === 'WITHDRAWAL') {
            return Promise.resolve({ _sum: { amount: 30 } });
        }
        return Promise.resolve({ _sum: { amount: 0 } });
      });

      expect(await service.getBalance('user1')).toBe(70);
    });

    it('should handle null sums (no transactions)', async () => {
        prisma.transaction.aggregate.mockResolvedValue({ _sum: { amount: null } });
        expect(await service.getBalance('user1')).toBe(0);
    });
  });
});
