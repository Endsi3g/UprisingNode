/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { EventsGateway } from './events.gateway';
import { Socket } from 'socket.io';

describe('EventsGateway', () => {
  let gateway: EventsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsGateway],
    }).compile();

    gateway = module.get<EventsGateway>(EventsGateway);
  });

  it('should be defined', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(gateway).toBeDefined();
  });

  it('handlePing should return pong', () => {
    const mockSocket = {} as Socket;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(gateway.handlePing(mockSocket, {})).toBe('pong');
  });
});
