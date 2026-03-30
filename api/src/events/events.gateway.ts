import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('ping')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handlePing(_client: Socket, _data: unknown) {
    return { event: 'pong', data: 'Server is alive' };
  }

  // Method to be called by services when things change
  // eslint-disable-next-line @typescript-eslint/require-await
  async notifyUser(userId: string, event: string, data: unknown) {
    // In a real app, you'd map user IDs to socket IDs
    // For MVP, we broadcast to a user-specific room if they joined one
    this.server.to(`user_${userId}`).emit(event, data);
  }
}
