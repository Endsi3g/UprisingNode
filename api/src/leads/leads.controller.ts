import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  create(@Request() req: any, @Body() createLeadDto: CreateLeadDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = req.user.userId as string;
    return this.leadsService.create(userId, createLeadDto);
  }

  @Get()
  findAll(@Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = req.user.userId as string;
    return this.leadsService.findAll(userId);
  }

  @Get('stats')
  async getStats(@Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = req.user.userId as string;
    const leads = await this.leadsService.findAll(userId);

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
  findOne(@Request() req: any, @Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = req.user.userId as string;
    return this.leadsService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateLeadDto: UpdateLeadDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = req.user.userId as string;
    return this.leadsService.update(userId, id, updateLeadDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = req.user.userId as string;
    return this.leadsService.remove(userId, id);
  }
}
