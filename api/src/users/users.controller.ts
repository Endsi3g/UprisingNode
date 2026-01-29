import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/request-with-user.interface';

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
  getProfile(@Request() req: RequestWithUser) {
    return this.usersService.findOne(req.user.userId);
  }

  @Patch('profile')
  updateProfile(
    @Request() req: RequestWithUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.update(req.user.userId, dto);
  }
}
