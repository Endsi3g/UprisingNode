import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { TransactionsModule } from '../transactions/transactions.module';
import { LeadsModule } from '../leads/leads.module';

@Module({
    imports: [TransactionsModule, LeadsModule],
    controllers: [DashboardController],
})
export class DashboardModule { }
