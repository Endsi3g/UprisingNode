import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from '../auth/password.service';
import { UpdateProfileDto } from './dto/user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
  ) {}

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: { leads: true, transactions: true },
        },
      },
    });
  }

  async findAllPartners() {
    // 1. Fetch basic partner info
    const partners = await this.prisma.user.findMany({
      where: {
        role: { in: ['PARTNER', 'ADMIN'] },
      },
      select: {
        id: true,
        name: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });

    const partnerIds = partners.map((p) => p.id);
    if (partnerIds.length === 0) return [];

    // 2. Aggregate Total Earnings
    const earningsAggregates = await this.prisma.transaction.groupBy({
      by: ['userId'],
      where: {
        userId: { in: partnerIds },
        type: 'COMMISSION',
        status: 'PAID',
      },
      _sum: {
        amount: true,
      },
    });

    // Map earnings to userId
    const earningsMap = new Map<string, number>();
    earningsAggregates.forEach((agg) => {
      if (agg._sum.amount !== null) {
        earningsMap.set(agg.userId, agg._sum.amount);
      }
    });

    // 3. Aggregate Deals This Month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const dealsAggregates = await this.prisma.transaction.groupBy({
      by: ['userId'],
      where: {
        userId: { in: partnerIds },
        type: 'COMMISSION',
        status: 'PAID',
        createdAt: { gte: startOfMonth },
      },
      _count: {
        id: true,
      },
    });

    // Map deals to userId
    const dealsMap = new Map<string, number>();
    dealsAggregates.forEach((agg) => {
      dealsMap.set(agg.userId, agg._count.id);
    });

    // 4. Merge results
    return partners.map((p) => {
      const totalEarnings = earningsMap.get(p.id) || 0;
      const dealsThisMonth = dealsMap.get(p.id) || 0;

      return {
        id: p.id,
        name: p.name,
        expertise: 'Généraliste', // Placeholder
        tier:
          totalEarnings > 100000
            ? 'platinum'
            : totalEarnings > 50000
              ? 'gold'
              : 'silver',
        dealsThisMonth,
        totalEarnings,
        avatar: p.avatar,
        location: 'France', // Placeholder
      };
    });
  }

  async findOnePublic(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        role: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: { leads: true, transactions: true },
        },
        transactions: {
          where: { type: 'COMMISSION' },
          select: { amount: true },
        },
      },
    });

    if (!user) return null;

    // Calculate aggregates similar to findAllPartners
    const totalEarnings = user.transactions.reduce(
      (sum, t) => sum + t.amount,
      0,
    );

    return {
      id: user.id,
      name: user.name,
      expertise: 'Généraliste', // Placeholder
      tier:
        totalEarnings > 100000
          ? 'platinum'
          : totalEarnings > 50000
            ? 'gold'
            : 'silver',
      dealsThisMonth: Math.floor(Math.random() * 10), // Mock
      totalEarnings,
      avatar: user.avatar,
      location: 'France', // Placeholder
      joinDate: user.createdAt,
      stats: {
        leads: user._count.leads,
        deals: user._count.transactions, // usage of transactions as deals proxy
      },
    };
  }

  async update(id: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        name: true,
        avatar: true,
      },
    });
  }

  async changePassword(id: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const isValid = await this.passwordService.comparePassword(
      dto.oldPassword,
      user.password,
    );
    if (!isValid) throw new UnauthorizedException('Invalid current password');

    const hashedPassword = await this.passwordService.hashPassword(
      dto.newPassword,
    );

    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return { message: 'Password updated successfully' };
  }

  async updatePreferences(id: string, dto: UpdatePreferencesDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        twoFactorEnabled: true,
        emailNotifications: true,
        pushNotifications: true,
      },
    });
  }
}
