/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { TransactionsService } from '../transactions/transactions.service';
import { LeadsService } from '../leads/leads.service';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

interface DashboardStats {
  accumulatedGains: number;
  potentialGains: number;
  activePipeline: Array<{
    id: string;
    company: string;
    status: 'analysis' | 'pending' | 'approved';
    submittedAt: string;
    riskScore: string;
  }>;
  accountStatus: {
    active: boolean;
    verified: boolean;
  };
}

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly leadsService: LeadsService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats(@Request() req: any): Promise<DashboardStats> {
    const userId = req.user.userId;
    const accumulatedGains =
      await this.transactionsService.getTotalEarnings(userId);

    // Get user data for account status
    const user: User | null = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    // Calculate potential gains from leads in analysis or negotiation

    // Get active pipeline
    const leads = await this.leadsService.findAll(userId);

    // Calculate potential gains from leads not yet closed

    const potentialLeads = leads.filter(
      (l: any) =>
        l.status === 'ANALYSIS' ||
        l.status === 'NEGOTIATION' ||
        l.status === 'PROSPECT',
    );

    const potentialGains = potentialLeads.reduce((sum: any, lead: any) => {
      return sum + (lead.score || 0) * 10;
    }, 0);

    const activePipeline = leads

      .filter((l: any) => l.status !== 'CLOSED' && l.status !== 'LOST')

      .map((l: any) => ({
        id: l.id,
        company: l.companyName || 'Unknown',
        status:
          (l.status.toLowerCase() as 'analysis' | 'pending' | 'approved') ||
          'analysis',
        submittedAt: l.createdAt.toISOString(),
        riskScore: 'En attente', // Needs AI analysis service
      }))
      .slice(0, 5);

    return {
      accumulatedGains,
      potentialGains,
      activePipeline,
      accountStatus: {
        active: user?.role !== 'SUSPENDED',
        verified: user?.emailVerified ?? false,
      },
    };
  }

  @Get('commissions')
  @UseGuards(JwtAuthGuard)
  async getCommissions(@Request() req: any) {
    const userId = req.user.userId;
    const totalEarnings =
      await this.transactionsService.getTotalEarnings(userId);
    const pendingEarnings =
      await this.transactionsService.getPendingEarnings(userId);
    const monthlyEarnings =
      await this.transactionsService.getMonthlyEarnings(userId);

    // Avg per deal calculation
    const transactions = await this.transactionsService.findAll(userId);

    const paidCommissions = transactions.filter(
      (t: any) => t.type === 'COMMISSION' && t.status === 'PAID',
    );
    const avgPerDeal =
      paidCommissions.length > 0 ? totalEarnings / paidCommissions.length : 0;

    return {
      totalEarnings,
      pendingEarnings,
      thisMonth: monthlyEarnings,
      avgPerDeal,

      history: transactions.map((t: any) => ({
        id: t.id,
        company: t.description || 'Unknown', // We should probably store company name in transaction or link to lead
        type: 'closing', // Mock type for now as schema only has 'COMMISSION'
        amount: t.amount,
        date: t.createdAt.toISOString(),
        status: t.status.toLowerCase(),
      })),
    };
  }
}
