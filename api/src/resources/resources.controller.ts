import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.resourcesService.findAll({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      category,
      search,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.resourcesService.findOne(id);
  }
}
