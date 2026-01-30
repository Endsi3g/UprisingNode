import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  // ConnectedSocket,
} from '@nestjs/websockets';
// import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    return data;
  }
}
