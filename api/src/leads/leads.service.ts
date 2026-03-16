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

  async getStats(userId: string) {
    // ⚡ Bolt Optimization: Replace O(N) array filtering in application memory
    // with O(1) concurrent database-level aggregations.
    const [
      activeLeadsCount,
      inAuditCount,
      signedDealsCount,
      currentBalanceAggr,
    ] = await Promise.all([
      this.prisma.lead.count({
        where: { ownerId: userId, status: { notIn: ['CLOSED', 'LOST'] } },
      }),
      this.prisma.lead.count({
        where: { ownerId: userId, status: 'ANALYSIS' },
      }),
      this.prisma.lead.count({
        where: { ownerId: userId, status: 'CLOSED' },
      }),
      this.prisma.lead.aggregate({
        _sum: { score: true },
        where: { ownerId: userId, status: 'CLOSED' },
      }),
    ]);

    const currentBalance = (currentBalanceAggr._sum.score || 0) * 10;

    return {
      currentBalance,
      targetBalance: 15000,
      activeLeads: activeLeadsCount,
      inAudit: inAuditCount,
      signedDeals: signedDealsCount,
      monthlyGrowth: 18, // TODO: Calculate from historical data
    };
  }

  async getPotentialGains(userId: string) {
    // ⚡ Bolt Optimization: Use Prisma aggregation to sum the score
    // instead of fetching all leads and filtering/reducing in memory.
    const potentialGainsAggr = await this.prisma.lead.aggregate({
      _sum: { score: true },
      where: {
        ownerId: userId,
        status: { in: ['ANALYSIS', 'NEGOTIATION', 'PROSPECT'] },
      },
    });

    return (potentialGainsAggr._sum.score || 0) * 10;
  }

  async getActivePipeline(userId: string) {
    // ⚡ Bolt Optimization: Use `take: 5` directly in DB query
    // to avoid fetching all active leads into memory just to map 5 of them.
    const leads = await this.prisma.lead.findMany({
      where: {
        ownerId: userId,
        status: { notIn: ['CLOSED', 'LOST'] },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return leads.map((l) => ({
      id: l.id,
      company: l.companyName || 'Unknown',
      status:
        (l.status.toLowerCase() as 'analysis' | 'pending' | 'approved') ||
        'analysis',
      submittedAt: l.createdAt.toISOString(),
      riskScore: 'En attente', // Needs AI analysis service
    }));
  }
}
