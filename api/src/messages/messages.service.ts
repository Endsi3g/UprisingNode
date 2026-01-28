import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createMessageDto: CreateMessageDto) {
    return this.prisma.message.create({
      data: {
        content: createMessageDto.content,
        conversationId: createMessageDto.conversationId,
        sender: 'me',
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
