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

  // ⚡ Bolt: Added getStats method to compute stats via DB aggregations instead of in-memory filtering.
  async getStats(userId: string) {
    const statusCounts = await this.prisma.lead.groupBy({
      by: ['status'],
      where: { ownerId: userId },
      _count: { _all: true },
    });

    const activeLeadsCount = statusCounts
      .filter((s) => s.status !== 'CLOSED' && s.status !== 'LOST')
      .reduce((acc, curr) => acc + curr._count._all, 0);

    const inAuditCount = statusCounts
      .filter((s) => s.status === 'ANALYSIS')
      .reduce((acc, curr) => acc + curr._count._all, 0);

    const signedDealsCount = statusCounts
      .filter((s) => s.status === 'CLOSED')
      .reduce((acc, curr) => acc + curr._count._all, 0);

    const scoreSumResult = await this.prisma.lead.aggregate({
      _sum: { score: true },
      where: {
        ownerId: userId,
        status: 'CLOSED',
      },
    });

    const currentBalance = (scoreSumResult._sum.score || 0) * 10;

    return {
      currentBalance,
      targetBalance: 15000,
      activeLeads: activeLeadsCount,
      inAudit: inAuditCount,
      signedDeals: signedDealsCount,
      monthlyGrowth: 18, // TODO: Calculate from historical data
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
