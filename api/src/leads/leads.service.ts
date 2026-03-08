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

  // ⚡ Bolt Optimization: Calculate potential gains at the database level using Prisma aggregate.
  // This avoids loading all leads into memory and reduces computation latency.
  async getPotentialGains(userId: string): Promise<number> {
    const aggregations = await this.prisma.lead.aggregate({
      _sum: { score: true },
      where: {
        ownerId: userId,
        status: {
          in: ['ANALYSIS', 'NEGOTIATION', 'PROSPECT'],
        },
      },
    });

    // Each score point corresponds to 10 potential gain value as per the original logic
    return (aggregations._sum.score || 0) * 10;
  }

  // ⚡ Bolt Optimization: Fetch only the required active pipeline leads directly from the database using 'take'.
  // This prevents an O(N) memory bottleneck and sorts descending by createdAt for better UI relevance.
  async getActivePipeline(userId: string) {
    return this.prisma.lead.findMany({
      where: {
        ownerId: userId,
        status: {
          notIn: ['CLOSED', 'LOST'],
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
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
}
