import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateLeadDto) {
    return this.prisma.lead.create({
      data: {
        ...dto,
        ownerId: userId,
        status: 'PROSPECT',
        score: Math.floor(Math.random() * 100), // Mock AI score
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.lead.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ⚡ Bolt Optimization: Use database-level aggregations to calculate stats instead of O(N) in-memory filtering.
  // Expected impact: Significant reduction in memory usage and faster response times for users with many leads.
  async getStats(userId: string) {
    const statusCounts = await this.prisma.lead.groupBy({
      by: ['status'],
      where: { ownerId: userId },
      _count: { _all: true },
    });

    let inAudit = 0;
    let signedDeals = 0;
    let totalExcludingClosedLost = 0;

    for (const group of statusCounts) {
      const count = group._count._all;
      if (group.status === 'ANALYSIS') inAudit += count;
      if (group.status === 'CLOSED') signedDeals += count;
      if (group.status !== 'CLOSED' && group.status !== 'LOST') {
        totalExcludingClosedLost += count;
      }
    }

    const currentBalanceAggr = await this.prisma.lead.aggregate({
      where: {
        ownerId: userId,
        status: 'CLOSED',
      },
      _sum: {
        score: true,
      },
    });

    const currentBalance = (currentBalanceAggr._sum.score || 0) * 10;

    return {
      activeLeads: totalExcludingClosedLost,
      inAudit,
      signedDeals,
      currentBalance,
    };
  }

  async findOne(userId: string, id: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, ownerId: userId },
    });
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async update(userId: string, id: string, dto: UpdateLeadDto) {
    // Verify ownership
    await this.findOne(userId, id);
    return this.prisma.lead.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    // Verify ownership
    await this.findOne(userId, id);
    return this.prisma.lead.delete({
      where: { id },
    });
  }
}
