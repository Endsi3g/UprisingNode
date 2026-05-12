import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTransactionDto) {
    if (dto.type === 'WITHDRAWAL') {
      const balance = await this.getBalance(userId);
      if (balance < dto.amount) {
        throw new Error('Insufficient balance');
      }
    }

    return this.prisma.transaction.create({
      data: {
        ...dto,
        userId,
        status: 'PENDING',
      },
    });
  }

  async getBalance(userId: string): Promise<number> {
    // ⚡ Bolt: Compute sums at the database level using Prisma aggregate instead of in-memory reduce.
    // Expected performance impact: Reduces O(N) memory usage and data transfer to O(1) time/memory complexity per query.
    const [commissionAggr, withdrawalAggr] = await Promise.all([
      this.prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          userId,
          type: 'COMMISSION',
          status: 'PAID',
        },
      }),
      this.prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          userId,
          type: 'WITHDRAWAL',
          status: { not: 'CANCELLED' },
        },
      }),
    ]);

    const totalCommissions = commissionAggr._sum.amount || 0;
    const totalWithdrawals = withdrawalAggr._sum.amount || 0;

    return totalCommissions - totalWithdrawals;
  }

  async getTotalEarnings(userId: string): Promise<number> {
    const aggregations = await this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        type: 'COMMISSION',
        status: 'PAID',
      },
    });
    return aggregations._sum.amount || 0;
  }

  async getPendingEarnings(userId: string): Promise<number> {
    const aggregations = await this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        type: 'COMMISSION',
        status: 'PENDING',
      },
    });
    return aggregations._sum.amount || 0;
  }

  async getMonthlyEarnings(userId: string): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const aggregations = await this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        type: 'COMMISSION',
        status: 'PAID',
        createdAt: { gte: startOfMonth },
      },
    });
    return aggregations._sum.amount || 0;
  }

  async findAll(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });
    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
  }

  async update(userId: string, id: string, dto: UpdateTransactionDto) {
    await this.findOne(userId, id);
    return this.prisma.transaction.update({
      where: { id },
      data: dto,
    });
  }
}
