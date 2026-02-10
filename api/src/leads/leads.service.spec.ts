import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { PrismaService } from '../prisma/prisma.service';

// Define a type for the mock that matches the structure we need
type MockPrismaService = {
  lead: {
    create: jest.Mock;
    findMany: jest.Mock;
    findFirst: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    aggregate: jest.Mock;
  };
};

describe('LeadsService', () => {
  let service: LeadsService;
  let prisma: MockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        {
          provide: PrismaService,
          useValue: {
            lead: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              aggregate: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
    // Cast the injected PrismaService to our mock type
    prisma = module.get<PrismaService>(
      PrismaService,
    ) as unknown as MockPrismaService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPotentialGains', () => {
    it('should return calculated gains', async () => {
      const mockAggregate = { _sum: { score: 100 } };
      prisma.lead.aggregate.mockResolvedValue(mockAggregate);

      const result = await service.getPotentialGains('user-1');
      expect(result).toBe(1000); // 100 * 10
      expect(prisma.lead.aggregate).toHaveBeenCalledWith({
        _sum: { score: true },
        where: {
          ownerId: 'user-1',
          status: { in: ['ANALYSIS', 'NEGOTIATION', 'PROSPECT'] },
        },
      });
    });

    it('should return 0 if score sum is null', async () => {
      const mockAggregate = { _sum: { score: null } };
      prisma.lead.aggregate.mockResolvedValue(mockAggregate);

      const result = await service.getPotentialGains('user-1');
      expect(result).toBe(0);
    });
  });

  describe('getActivePipeline', () => {
    it('should return active leads', async () => {
      const mockLeads = [{ id: '1' }, { id: '2' }];
      prisma.lead.findMany.mockResolvedValue(mockLeads);

      const result = await service.getActivePipeline('user-1');
      expect(result).toEqual(mockLeads);
      expect(prisma.lead.findMany).toHaveBeenCalledWith({
        where: {
          ownerId: 'user-1',
          status: { notIn: ['CLOSED', 'LOST'] },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
    });
  });
});
