import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';

@Injectable()
export class LeadsService {
    constructor(private prisma: PrismaService) { }

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
        const leads = await this.prisma.lead.findMany({
            where: { ownerId: userId },
        });

        const transactions = await this.prisma.transaction.findMany({
            where: { userId },
        });

        const currentBalance = transactions.reduce((sum, t) => sum + t.amount, 0);

        return {
            currentBalance,
            targetBalance: 15000, // Hardcoded goal
            activeLeads: leads.filter((l) => l.status !== 'SIGNED').length,
            inAudit: leads.filter((l) => l.status === 'AUDIT').length,
            signedDeals: leads.filter((l) => l.status === 'SIGNED').length,
            monthlyGrowth: 12.5, // Mock calculation
        };
    }
}
