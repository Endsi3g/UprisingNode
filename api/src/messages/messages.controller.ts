import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Request() req, @Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(req.user.userId, createMessageDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.messagesService.findAll(req.user.userId);
  }
}
