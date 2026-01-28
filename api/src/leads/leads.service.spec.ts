import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('LeadsService', () => {
  let service: LeadsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    lead: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    transaction: {
      findMany: jest.fn(),
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        { provide: PrismaService, useValue: mockPrismaService },
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
      const userId = 'user1';
      mockPrismaService.lead.create.mockResolvedValue({ id: '1', ...dto, ownerId: userId });

      const result = await service.create(userId, dto);
      expect(result).toHaveProperty('id');
      expect(prisma.lead.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return array of leads', async () => {
      const userId = 'user1';
      mockPrismaService.lead.findMany.mockResolvedValue([]);

      const result = await service.findAll(userId);
      expect(result).toEqual([]);
    });
  });

  describe('getStats', () => {
      it('should return stats', async () => {
          const userId = 'user1';
          mockPrismaService.lead.findMany.mockResolvedValue([
              { status: 'PROSPECT' },
              { status: 'AUDIT' },
              { status: 'SIGNED' }
          ]);
          mockPrismaService.transaction.findMany.mockResolvedValue([
              { amount: 100 },
              { amount: 200 }
          ]);

          const result = await service.getStats(userId);

          expect(result.currentBalance).toBe(300);
          expect(result.activeLeads).toBe(2); // Prospect + Audit
          expect(result.inAudit).toBe(1);
          expect(result.signedDeals).toBe(1);
      });
  });
});
