import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/authenticated-request.interface';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @Request() req: AuthenticatedRequest,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(
      req.user.userId,
      createTransactionDto,
    );
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    return this.transactionsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.transactionsService.findOne(req.user.userId, id);
  }

  // Future feature: withdrawal requests
  @Post('withdraw')
  requestWithdrawal(
    @Request() req: AuthenticatedRequest,
    @Body('amount') amount: number,
  ) {
    return this.transactionsService.create(req.user.userId, {
      amount: -amount, // Negative amount for withdrawal
      type: 'PAYOUT',
      description: 'Withdrawal request',
    });
  }
}
