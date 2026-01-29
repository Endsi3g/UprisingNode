import { Test, TestingModule } from '@nestjs/testing';
import { EventsGateway } from './events.gateway';
import { Socket } from 'socket.io';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
describe('EventsGateway', () => {
  let gateway: EventsGateway;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsGateway],
    }).compile();

    gateway = module.get<EventsGateway>(EventsGateway);
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  it('should be defined', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    expect(gateway).toBeDefined();
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  it('handlePing should return pong', () => {
    const mockSocket = {} as Socket;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    expect(gateway.handlePing(mockSocket, {})).toBe('pong');
  });
});
