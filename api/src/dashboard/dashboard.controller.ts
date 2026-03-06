import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { TransactionsService } from '../transactions/transactions.service';
import { LeadsService } from '../leads/leads.service';
import { PrismaService } from '../prisma/prisma.service';

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

    // BOLT OPTIMIZATION:
    // Run all independent queries concurrently instead of sequentially.
    // Replace in-memory mapping, filtering and slicing with DB-level optimizations in service.
    const [accumulatedGains, user, potentialGains, activeLeads] =
      await Promise.all([
        this.transactionsService.getTotalEarnings(userId),
        this.prisma.user.findUnique({ where: { id: userId } }),
        this.leadsService.getPotentialGains(userId),
        this.leadsService.getActivePipeline(userId, 5),
      ]);

    const activePipeline = activeLeads.map((l) => ({
      id: l.id,
      company: l.companyName || 'Unknown',
      status:
        (l.status.toLowerCase() as 'analysis' | 'pending' | 'approved') ||
        'analysis',
      submittedAt: l.createdAt.toISOString(),
      riskScore: 'En attente', // Needs AI analysis service
    }));

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

    // BOLT OPTIMIZATION:
    // Parallelize data fetching and replace O(N) transaction mapping with database-level constraints.
    const [stats, recentCommissions] = await Promise.all([
      this.transactionsService.getCommissionsStats(userId),
      this.transactionsService.findCommissions(userId, 20),
    ]);

    const avgPerDeal =
      stats.paidCommissionsCount > 0
        ? stats.totalEarnings / stats.paidCommissionsCount
        : 0;

    return {
      totalEarnings: stats.totalEarnings,
      pendingEarnings: stats.pendingEarnings,
      thisMonth: stats.monthlyEarnings,
      avgPerDeal,
      history: recentCommissions.map((t) => ({
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
