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

  // ⚡ Bolt Performance Optimization:
  // Migrated stats calculation from in-memory array filtering (O(n) where n is total leads)
  // to database-level aggregation via Prisma.
  // Expected impact: Memory usage reduction from O(n) to O(1), faster response time,
  // and eliminated unnecessary network transfer of unused lead data.
  async getStats(userId: string) {
    const statusCounts = await this.prisma.lead.groupBy({
      by: ['status'],
      where: { ownerId: userId },
      _count: { _all: true },
    });

    const currentBalanceAgg = await this.prisma.lead.aggregate({
      where: { ownerId: userId, status: 'CLOSED' },
      _sum: { score: true },
    });

    let activeLeads = 0;
    let inAudit = 0;
    let signedDeals = 0;

    for (const group of statusCounts) {
      if (group.status !== 'CLOSED' && group.status !== 'LOST') {
        activeLeads += group._count._all;
      }
      if (group.status === 'ANALYSIS') {
        inAudit += group._count._all;
      }
      if (group.status === 'CLOSED') {
        signedDeals += group._count._all;
      }
    }

    const currentBalance = (currentBalanceAgg._sum.score || 0) * 10;

    return {
      currentBalance,
      targetBalance: 15000,
      activeLeads,
      inAudit,
      signedDeals,
      monthlyGrowth: 18, // TODO: Calculate from historical data
    };
  }
}
