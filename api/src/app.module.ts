import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { LeadsModule } from './leads/leads.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';
import { ScraperService } from './scraper/scraper.service';
import { ScraperController } from './scraper/scraper.controller';
import { EventsModule } from './events/events.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [AuthModule, PrismaModule, LeadsModule, TransactionsModule, UsersModule, EventsModule, MessagesModule],
  controllers: [AppController, ScraperController],
  providers: [AppService, ScraperService],
})
export class AppModule { }
