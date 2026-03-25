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

    // ⚡ Bolt: Execute independent queries concurrently to reduce overall response latency
    const [accumulatedGains, user, leads] = await Promise.all([
      this.transactionsService.getTotalEarnings(userId),
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.leadsService.findAll(userId),
    ]);

    // Calculate potential gains from leads not yet closed
    const potentialLeads = leads.filter(
      (l) =>
        l.status === 'ANALYSIS' ||
        l.status === 'NEGOTIATION' ||
        l.status === 'PROSPECT',
    );
    const potentialGains = potentialLeads.reduce((sum, lead) => {
      return sum + (lead.score || 0) * 10;
    }, 0);

    const activePipeline = leads
      .filter((l) => l.status !== 'CLOSED' && l.status !== 'LOST')
      .map((l) => ({
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
  async getCommissions(@Request() req: AuthenticatedRequest) {
    const userId = req.user.userId;

    // ⚡ Bolt: Execute independent queries concurrently to improve response time from O(N) to O(1)
    const [totalEarnings, pendingEarnings, monthlyEarnings, transactions] =
      await Promise.all([
        this.transactionsService.getTotalEarnings(userId),
        this.transactionsService.getPendingEarnings(userId),
        this.transactionsService.getMonthlyEarnings(userId),
        this.transactionsService.findAll(userId),
      ]);
    const paidCommissions = transactions.filter(
      (t) => t.type === 'COMMISSION' && t.status === 'PAID',
    );
    const avgPerDeal =
      paidCommissions.length > 0 ? totalEarnings / paidCommissions.length : 0;

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
