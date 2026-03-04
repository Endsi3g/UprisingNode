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

  // ⚡ Bolt: Fetch only a limited number of non-closed/lost leads directly from the database
  // Impact: O(1) memory vs O(N) when fetching all leads
  async getActivePipeline(userId: string, limit: number) {
    return this.prisma.lead.findMany({
      where: {
        ownerId: userId,
        status: { notIn: ['CLOSED', 'LOST'] },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        companyName: true,
        status: true,
        createdAt: true,
      },
    });
  }

  // ⚡ Bolt: Calculate potential gains using database aggregations instead of in-memory reduce
  // Impact: Eliminates fetching all leads just to sum their scores
  async getPotentialGains(userId: string): Promise<number> {
    const aggregations = await this.prisma.lead.aggregate({
      _sum: { score: true },
      where: {
        ownerId: userId,
        status: { in: ['ANALYSIS', 'NEGOTIATION', 'PROSPECT'] },
      },
    });
    // Each score point equals 10 units in potential gains
    return (aggregations._sum.score || 0) * 10;
  }

  // ⚡ Bolt: Compute stats at the database level instead of fetching everything
  // Impact: Reduces payload size and CPU usage significantly for users with many leads
  async getLeadStats(userId: string) {
    // Execute all independent aggregation queries concurrently for maximum performance
    const [activeLeadsCount, inAuditCount, signedDealsCount, closedScoreAgg] =
      await Promise.all([
        this.prisma.lead.count({
          where: {
            ownerId: userId,
            status: { notIn: ['CLOSED', 'LOST'] },
          },
        }),
        this.prisma.lead.count({
          where: {
            ownerId: userId,
            status: 'ANALYSIS',
          },
        }),
        this.prisma.lead.count({
          where: {
            ownerId: userId,
            status: 'CLOSED',
          },
        }),
        this.prisma.lead.aggregate({
          _sum: { score: true },
          where: {
            ownerId: userId,
            status: 'CLOSED',
          },
        }),
      ]);

    const currentBalance = (closedScoreAgg._sum.score || 0) * 10;

    return {
      activeLeads: activeLeadsCount,
      inAudit: inAuditCount,
      signedDeals: signedDealsCount,
      currentBalance,
    };
  }
}
