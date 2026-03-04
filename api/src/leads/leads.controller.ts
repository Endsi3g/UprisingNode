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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.leadsService.create(req.user.userId, createLeadDto);
  }

  @Get()
  findAll(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.leadsService.findAll(req.user.userId);
  }

  @Get('stats')
  async getStats(@Request() req: any) {
    // ⚡ Bolt: Offload stats calculation to the database layer
    // Impact: Avoids loading all leads into memory for aggregations, saving memory and CPU

    const stats: any = await this.leadsService.getLeadStats(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      req.user.userId as string,
    );

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      currentBalance: stats.currentBalance,
      targetBalance: 15000,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      activeLeads: stats.activeLeads,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      inAudit: stats.inAudit,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      signedDeals: stats.signedDeals,
      monthlyGrowth: 18, // TODO: Calculate from historical data
    };
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.leadsService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateLeadDto: UpdateLeadDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.leadsService.update(req.user.userId, id, updateLeadDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.leadsService.remove(req.user.userId, id);
  }
}
