import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { TransactionsService } from '../transactions/transactions.service';
import { LeadsService } from '../leads/leads.service';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthenticatedRequest } from '../auth/types';

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
  async getStats(
    @Request() req: AuthenticatedRequest,
  ): Promise<DashboardStats> {
    const userId = req.user.userId;

    // ⚡ Bolt: Use Promise.all and database-level aggregations to prevent O(N) array filtering bottleneck
    const [accumulatedGains, user, potentialGains, activePipeline] =
      await Promise.all([
        this.transactionsService.getTotalEarnings(userId),
        this.prisma.user.findUnique({ where: { id: userId } }),
        this.leadsService.getPotentialGains(userId),
        this.leadsService.getActivePipeline(userId),
      ]);

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
  async getCommissions(@Request() req: AuthenticatedRequest) {
    const userId = req.user.userId;

    // ⚡ Bolt: Concurrent fetching with Promise.all and database-level counting
    const [
      totalEarnings,
      pendingEarnings,
      monthlyEarnings,
      paidCommissionsCount,
      transactions,
    ] = await Promise.all([
      this.transactionsService.getTotalEarnings(userId),
      this.transactionsService.getPendingEarnings(userId),
      this.transactionsService.getMonthlyEarnings(userId),
      this.transactionsService.countPaidCommissions(userId),
      this.transactionsService.findAll(userId),
    ]);

    const avgPerDeal =
      paidCommissionsCount > 0 ? totalEarnings / paidCommissionsCount : 0;

    return {
      totalEarnings,
      pendingEarnings,
      thisMonth: monthlyEarnings,
      avgPerDeal,
      history: transactions.map((t) => ({
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
