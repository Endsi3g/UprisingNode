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
  create(@Request() req, @Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(req.user.userId, createLeadDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.leadsService.findAll(req.user.userId);
  }

  @Get('stats')
  async getStats(@Request() req) {
    // ⚡ Bolt: Offload stats calculation to the database layer
    // Impact: Avoids loading all leads into memory for aggregations, saving memory and CPU
    const stats = await this.leadsService.getLeadStats(req.user.userId);

    return {
      currentBalance: stats.currentBalance,
      targetBalance: 15000,
      activeLeads: stats.activeLeads,
      inAudit: stats.inAudit,
      signedDeals: stats.signedDeals,
      monthlyGrowth: 18, // TODO: Calculate from historical data
    };
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.leadsService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateLeadDto: UpdateLeadDto,
  ) {
    return this.leadsService.update(req.user.userId, id, updateLeadDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.leadsService.remove(req.user.userId, id);
  }
}
