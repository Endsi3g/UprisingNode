import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('ping')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handlePing(_client: Socket, _data: unknown): string {
    return 'pong';
  }

  // Helper method to broadcast events (can be injected into services)

  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }
}
