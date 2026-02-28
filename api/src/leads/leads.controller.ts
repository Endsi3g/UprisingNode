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

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

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
    const userId = req.user.userId;

    const [activeLeads, inAudit, signedDeals, currentBalance] =
      await Promise.all([
        this.leadsService.getActiveLeadsCount(userId),
        this.leadsService.getLeadsCountByStatus(userId, 'ANALYSIS'),
        this.leadsService.getLeadsCountByStatus(userId, 'CLOSED'),
        this.leadsService.getCurrentBalance(userId),
      ]);

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
