import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Request() req, @Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(
      req.user.userId,
      createTransactionDto,
    );
  }

  @Get()
  findAll(@Request() req) {
    return this.transactionsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.transactionsService.findOne(req.user.userId, id);
  }

  // Only for simulation/dev purposes in this MVP
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(
      req.user.userId,
      id,
      updateTransactionDto,
    );
  }
}
