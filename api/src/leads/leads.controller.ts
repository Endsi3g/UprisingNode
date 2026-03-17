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
  Query,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  create(@Body() createLeadDto: CreateLeadDto, @Request() req: any) {

    return this.leadsService.create(createLeadDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req: any) {

    return this.leadsService.findAll(req.user.userId);
  }

  @Get('stats')
  getStats(@Request() req: any) {

    return this.leadsService.getStats(req.user.userId);
  }

  @Get('export')
  exportCsv(@Request() req: any) {
    // Implementation placeholder

    return `Exporting leads for user ${req.user.userId}`;
  }

  @Get('import')
  importCsv(@Request() req: any) {
    // Implementation placeholder

    return `Importing leads for user ${req.user.userId}`;
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {

    return this.leadsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLeadDto: UpdateLeadDto,
    @Request() req: any,
  ) {

    return this.leadsService.update(id, updateLeadDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {

    return this.leadsService.remove(id, req.user.userId);
  }
}
