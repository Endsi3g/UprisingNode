import { Test, TestingModule } from '@nestjs/testing';
import { EventsGateway } from './events.gateway';

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

  it('should handle ping', () => {
    const client = {};
    const data = {};
    // @ts-expect-error - mock socket
    expect(gateway.handlePing(client, data)).toBe('pong');
  });
});
