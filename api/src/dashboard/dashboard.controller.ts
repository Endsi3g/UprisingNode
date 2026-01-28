import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/public.decorator';
import { TransactionsService } from '../transactions/transactions.service';
import { LeadsService } from '../leads/leads.service';

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
  ) {}

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats(@Request() req): Promise<DashboardStats> {
    const userId = req.user.userId;
    const accumulatedGains =
      await this.transactionsService.getTotalEarnings(userId);
    const potentialGains = 1450; // TODO: Calculate from leads in 'analysis' or 'negotiation'

    // Get active pipeline
    const leads = await this.leadsService.findAll(userId);
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
        active: true,
        verified: true,
      },
    };
  }

  @Get('commissions')
  @UseGuards(JwtAuthGuard)
  async getCommissions(@Request() req) {
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
