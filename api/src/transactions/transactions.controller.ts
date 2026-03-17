/* eslint-disable */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req: any,
  ) {
    return this.transactionsService.create(
      createTransactionDto,
      req.user.userId,
    );
  }

  @Get()
  findAll(@Request() req: any) {

    return this.transactionsService.findAll(req.user.userId);
  }

  @Get('stats')
  getStats(@Request() req: any) {

    return this.transactionsService.getStats(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {

    return this.transactionsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: any,
    @Request() req: any,
  ) {
    return this.transactionsService.update(
      id,
      updateTransactionDto,
      req.user.userId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {

    return this.transactionsService.remove(id, req.user.userId);
  }
}
