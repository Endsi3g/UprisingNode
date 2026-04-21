import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: { id: string }) {
    console.log(`Client connected: ${client?.id}`);
  }

  handleDisconnect(client: { id: string }) {
    console.log(`Client disconnected: ${client?.id}`);
  }

  @SubscribeMessage('ping')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handlePing(client: { id: string }, data: unknown): string {
    return 'pong';
  }

  // Helper method to broadcast events (can be injected into services)
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }
}
