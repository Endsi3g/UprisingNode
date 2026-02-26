import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { PrismaService } from '../prisma/prisma.service';

describe('LeadsService', () => {
  let service: LeadsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    lead: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      aggregate: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a lead', async () => {
      const dto = { url: 'http://example.com' };
      const userId = 'user-1';
      mockPrismaService.lead.create.mockResolvedValue({ id: '1', ...dto });

      expect(await service.create(userId, dto)).toEqual({ id: '1', ...dto });
      expect(prisma.lead.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of leads', async () => {
      const result = [{ id: '1', url: 'http://example.com' }];
      mockPrismaService.lead.findMany.mockResolvedValue(result);

      expect(await service.findAll('user-1')).toBe(result);
    });
  });

  describe('getPotentialGains', () => {
    it('should calculate potential gains correctly', async () => {
      const userId = 'user-1';
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
      (prisma.lead.aggregate as jest.Mock).mockResolvedValue({
        _sum: { score: 150 },
      });

      // We need to cast service to any because the method doesn't exist yet
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
      const result = await (service as any).getPotentialGains(userId);

      expect(result).toBe(1500); // 150 * 10
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
      expect(prisma.lead.aggregate).toHaveBeenCalledWith({
        _sum: { score: true },
        where: {
          ownerId: userId,
          status: { in: ['ANALYSIS', 'NEGOTIATION', 'PROSPECT'] },
        },
      });
    });

    it('should return 0 if no scores found', async () => {
      const userId = 'user-1';
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
      (prisma.lead.aggregate as jest.Mock).mockResolvedValue({
        _sum: { score: null },
      });

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
      const result = await (service as any).getPotentialGains(userId);
      expect(result).toBe(0);
    });
  });

  describe('getActivePipeline', () => {
    it('should return active pipeline leads', async () => {
      const userId = 'user-1';
      const mockLeads = [
        { id: '1', status: 'ANALYSIS', createdAt: new Date() },
        { id: '2', status: 'NEGOTIATION', createdAt: new Date() },
      ];
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
      (prisma.lead.findMany as jest.Mock).mockResolvedValue(mockLeads);

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
      const result = await (service as any).getActivePipeline(userId);

      expect(result).toEqual(mockLeads);
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
      expect(prisma.lead.findMany).toHaveBeenCalledWith({
        where: {
          ownerId: userId,
          status: { notIn: ['CLOSED', 'LOST'] },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
    });
  });
});
