import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { DashboardController } from './dashboard.controller';
import { TransactionsModule } from '../transactions/transactions.module';
import { LeadsModule } from '../leads/leads.module';

@Module({
  imports: [
    CacheModule.register({ ttl: 10000 }),
    TransactionsModule,
    LeadsModule,
  ],
  controllers: [DashboardController],
})
export class DashboardModule {}
