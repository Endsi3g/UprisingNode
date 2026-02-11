import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  afterInit(server: Server) {
    console.log('WebSocket Initialized');
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('ping')
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  handlePing(client: Socket, data: any): string {
    return 'pong';
  }

  // Example: Notify dashboard of new lead
  notifyNewLead(lead: any) {
    this.server.emit('newLead', lead);
  }
}
