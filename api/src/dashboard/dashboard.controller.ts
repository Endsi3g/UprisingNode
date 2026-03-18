import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { TransactionsService } from '../transactions/transactions.service';
import { LeadsService } from '../leads/leads.service';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

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

    // ⚡ Bolt Optimization: Replace sequential awaits and in-memory O(N) array filtering
    // with concurrent Promise.all() and optimized database aggregations.
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

    // ⚡ Bolt Optimization: Fetch independent data concurrently via Promise.all.
    // Replace in-memory mapping of all transactions for count with optimized db-level count.
    const [
      totalEarnings,
      pendingEarnings,
      monthlyEarnings,
      transactions,
      paidCommissionsCount,
    ] = await Promise.all([
      this.transactionsService.getTotalEarnings(userId),
      this.transactionsService.getPendingEarnings(userId),
      this.transactionsService.getMonthlyEarnings(userId),
      this.transactionsService.findAll(userId),
      this.transactionsService.countPaidCommissions(userId),
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
