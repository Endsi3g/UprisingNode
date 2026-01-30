import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@UseGuards(JwtAuthGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  create(@Req() req: RequestWithUser, @Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(req.user.userId, createLeadDto);
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.leadsService.findAll(req.user.userId);
  }

  @Get('stats')
  async getStats(@Req() req: RequestWithUser) {
    const leads = await this.leadsService.findAll(req.user.userId);

    const activeLeads = leads.filter(
      (l) => l.status !== 'CLOSED' && l.status !== 'LOST',
    ).length;
    const inAudit = leads.filter((l) => l.status === 'ANALYSIS').length;
    const signedDeals = leads.filter((l) => l.status === 'CLOSED').length;

    // Calculate potential balance from lead scores
    const currentBalance = leads
      .filter((l) => l.status === 'CLOSED')
      .reduce((sum, l) => sum + (l.score || 0) * 10, 0);

    return {
      currentBalance,
      targetBalance: 15000,
      activeLeads,
      inAudit,
      signedDeals,
      monthlyGrowth: 18, // TODO: Calculate from historical data
    };
  }

  @Get(':id')
  findOne(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.leadsService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateLeadDto: UpdateLeadDto,
  ) {
    return this.leadsService.update(req.user.userId, id, updateLeadDto);
  }

  @Delete(':id')
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.leadsService.remove(req.user.userId, id);
  }
}
