import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { LeadsModule } from './leads/leads.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ScraperModule } from './scraper/scraper.module';
import { ConfigModule } from '@nestjs/config';
import { ResourcesModule } from './resources/resources.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    PrismaModule,
    LeadsModule,
    TransactionsModule,
    UsersModule,
    EventsModule,
    DashboardModule,
    ResourcesModule,
    ScraperModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
