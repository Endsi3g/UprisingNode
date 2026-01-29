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
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        status: { not: 'CANCELLED' },
      },
    });

    return transactions.reduce((acc, tx) => {
      if (tx.type === 'COMMISSION' && tx.status === 'PAID') {
        return acc + tx.amount;
      } else if (tx.type === 'WITHDRAWAL') {
        return acc - tx.amount;
      }
      return acc;
    }, 0);
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
