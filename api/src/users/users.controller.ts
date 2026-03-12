/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Body,
  Patch,
  Put,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/user.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('partners')
  findAllPartners() {
    return this.usersService.findAllPartners();
  }

  @Get(':id/details')
  async getPartnerDetails(@Param('id') id: string) {
    return this.usersService.findOnePublic(id);
  }

  @Get('profile') // /users/profile
  getProfile(@Request() req: any) {
    return this.usersService.findOne(req.user.userId as string);
  }

  @Patch('profile')
  updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.update(req.user.userId as string, dto);
  }
}
