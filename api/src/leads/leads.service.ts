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
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const [
            transactions,
            activeLeads,
            inAudit,
            signedDeals,
            thisMonthLeads,
            lastMonthLeads,
        ] = await Promise.all([
            this.prisma.transaction.findMany({
                where: {
                    userId,
                    status: { in: ['VALIDATED', 'PAID'] },
                },
                select: { amount: true },
            }),
            this.prisma.lead.count({ where: { ownerId: userId, status: 'PROSPECT' } }),
            this.prisma.lead.count({ where: { ownerId: userId, status: 'AUDIT' } }),
            this.prisma.lead.count({ where: { ownerId: userId, status: 'SIGNED' } }),
            this.prisma.lead.count({
                where: {
                    ownerId: userId,
                    createdAt: { gte: startOfMonth },
                },
            }),
            this.prisma.lead.count({
                where: {
                    ownerId: userId,
                    createdAt: {
                        gte: startOfLastMonth,
                        lt: startOfMonth,
                    },
                },
            }),
        ]);

        const currentBalance = transactions.reduce((sum, t) => sum + t.amount, 0);

        // Target Balance Logic: 1.5x current or 15000 min (matching mock default)
        // Mock had 12450 current, 15000 target.
        // If I use 1.5x, it would be ~18000.
        // Let's use logic: Max(current * 1.2, 15000).
        const targetBalance = Math.max(Math.ceil(currentBalance * 1.2 / 1000) * 1000, 15000);

        // Monthly Growth Calculation
        let monthlyGrowth = 0;
        if (lastMonthLeads > 0) {
            monthlyGrowth = Math.round(((thisMonthLeads - lastMonthLeads) / lastMonthLeads) * 100);
        } else if (thisMonthLeads > 0) {
            monthlyGrowth = 100;
        }

        return {
            currentBalance,
            targetBalance,
            activeLeads,
            inAudit,
            signedDeals,
            monthlyGrowth,
        };
    }
}
