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

  // ⚡ Bolt: Calculate potential gains at DB level instead of O(N) in-memory
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
    return (aggregations._sum.score || 0) * 10;
  }

  // ⚡ Bolt: Fetch only needed active pipeline items instead of full table
  async getActivePipeline(userId: string) {
    const leads = await this.prisma.lead.findMany({
      where: {
        ownerId: userId,
        status: {
          notIn: ['CLOSED', 'LOST'],
        },
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        companyName: true,
        status: true,
        createdAt: true,
      },
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
