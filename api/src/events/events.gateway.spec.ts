import { Test, TestingModule } from '@nestjs/testing';
import { EventsGateway } from './events.gateway';
import { Socket } from 'socket.io';

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

describe('EventsGateway', () => {
  let gateway: EventsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsGateway],
    }).compile();

    gateway = module.get<EventsGateway>(EventsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('handlePing should return pong', () => {
    const mockSocket = {} as Socket;
    expect(gateway.handlePing(mockSocket, {})).toBe('pong');
  });
});
