import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class LeadsService {
    constructor(
        private prisma: PrismaService,
        private eventsGateway: EventsGateway,
    ) { }

    async create(userId: string, dto: CreateLeadDto) {
        return this.prisma.lead.create({
            data: {
                ...dto,
                ownerId: userId,
                status: 'PROSPECT',
                score: Math.floor(Math.random() * 100), // Mock AI score
            },
        });
    }

    async findAll(userId: string) {
        return this.prisma.lead.findMany({
            where: { ownerId: userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(userId: string, id: string) {
        const lead = await this.prisma.lead.findFirst({
            where: { id, ownerId: userId },
        });
        if (!lead) throw new NotFoundException('Lead not found');
        return lead;
    }

    async update(userId: string, id: string, dto: UpdateLeadDto) {
        // Verify ownership
        await this.findOne(userId, id);
        const updatedLead = await this.prisma.lead.update({
            where: { id },
            data: dto,
        });

        // Broadcast the update to all connected clients
        this.eventsGateway.broadcast('lead-updated', updatedLead);

        return updatedLead;
    }

    async remove(userId: string, id: string) {
        // Verify ownership
        await this.findOne(userId, id);
        return this.prisma.lead.delete({
            where: { id },
        });
    }
}
