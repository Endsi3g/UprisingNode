/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma/prisma.service';

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
              findMany: jest.fn(),
              aggregate: jest.fn(),
              create: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
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
    it('should calculate balance correctly', async () => {
      const aggregateMock = prisma.transaction.aggregate as jest.Mock;

      aggregateMock
        .mockResolvedValueOnce({ _sum: { amount: 100 } }) // Earned (COMMISSION, PAID)
        .mockResolvedValueOnce({ _sum: { amount: 30 } }); // Withdrawn (WITHDRAWAL, !CANCELLED)

      const balance = await service.getBalance('user1');
      expect(balance).toBe(70);
      expect(aggregateMock).toHaveBeenCalledTimes(2);
    });
  });
});
