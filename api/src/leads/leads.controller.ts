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
import { AuthenticatedRequest } from '../auth/authenticated-request.interface';

@UseGuards(JwtAuthGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  create(
    @Request() req: AuthenticatedRequest,
    @Body() createLeadDto: CreateLeadDto,
  ) {
    return this.leadsService.create(req.user.userId, createLeadDto);
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    return this.leadsService.findAll(req.user.userId);
  }

  @Get('stats')
  async getStats(@Request() req: AuthenticatedRequest) {
    const leads = await this.leadsService.findAll(req.user.userId);

    const activeLeads = leads.filter(
      (l) => l.status !== 'CLOSED' && l.status !== 'LOST',
    ).length;
    const inAudit = leads.filter((l) => l.status === 'ANALYSIS').length;
    const signedDeals = leads.filter((l) => l.status === 'CLOSED').length;

    // Calculate conversion rate
    const totalLeads = leads.length;
    const conversionRate =
      totalLeads > 0 ? (signedDeals / totalLeads) * 100 : 0;

    return {
      activeLeads,
      inAudit,
      signedDeals,
      conversionRate,
    };
  }

  @Get(':id')
  findOne(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.leadsService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateLeadDto: UpdateLeadDto,
  ) {
    return this.leadsService.update(req.user.userId, id, updateLeadDto);
  }

  @Delete(':id')
  remove(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.leadsService.remove(req.user.userId, id);
  }
}
