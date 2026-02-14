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
  create(
    @Request() req: any,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = req.user.userId as string;
    return this.transactionsService.create(userId, createTransactionDto);
  }

  @Get()
  findAll(@Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = req.user.userId as string;
    return this.transactionsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = req.user.userId as string;
    return this.transactionsService.findOne(userId, id);
  }

  // Only for simulation/dev purposes in this MVP
  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = req.user.userId as string;
    return this.transactionsService.update(userId, id, updateTransactionDto);
  }
}
