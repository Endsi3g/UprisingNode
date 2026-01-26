import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findOne(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatar: true,
                createdAt: true,
                _count: {
                    select: { leads: true, transactions: true },
                },
            },
        });
    }

    async update(id: string, dto: UpdateProfileDto) {
        return this.prisma.user.update({
            where: { id },
            data: dto,
            select: {
                id: true,
                name: true,
                avatar: true,
            }
        });
    }
}
