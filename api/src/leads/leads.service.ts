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

  // BOLT OPTIMIZATION:
  // Calculates potential gains at the database level instead of loading all leads in memory
  // Time complexity goes from O(N) to O(1) in application code, memory usage significantly reduced
  async getPotentialGains(userId: string): Promise<number> {
    const aggregations = await this.prisma.lead.aggregate({
      _sum: { score: true },
      where: {
        ownerId: userId,
        status: { in: ['ANALYSIS', 'NEGOTIATION', 'PROSPECT'] },
      },
    });
    // Each score point equals 10 monetary units (as defined in previous business logic)
    return (aggregations._sum.score || 0) * 10;
  }

  // BOLT OPTIMIZATION:
  // Fetches only the needed active pipeline items at database level
  // Replaces in-memory filter and slice(0,5) on potentially thousands of leads
  async getActivePipeline(userId: string, limit: number = 5) {
    return this.prisma.lead.findMany({
      where: {
        ownerId: userId,
        status: { notIn: ['CLOSED', 'LOST'] },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
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
