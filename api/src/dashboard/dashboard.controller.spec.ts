import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { TransactionsService } from '../transactions/transactions.service';
import { LeadsService } from '../leads/leads.service';

describe('DashboardController', () => {
  let controller: DashboardController;
  let leadsService: LeadsService;
  let transactionsService: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            getTotalEarnings: jest.fn().mockResolvedValue(1000),
            getPendingEarnings: jest.fn().mockResolvedValue(500),
            getMonthlyEarnings: jest.fn().mockResolvedValue(200),
            findAll: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: LeadsService,
          useValue: {
            findAll: jest.fn(),
            findActivePipeline: jest.fn().mockResolvedValue([
              {
                id: '1',
                companyName: 'Test Corp',
                status: 'PROSPECT',
                createdAt: new Date('2023-01-01'),
              },
            ]),
            calculatePotentialGains: jest.fn().mockResolvedValue(5000),
          },
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    leadsService = module.get<LeadsService>(LeadsService);
    transactionsService = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getStats', () => {
    it('should call findActivePipeline with correct parameters', async () => {
      const req = { user: { userId: 'user1' } };
      const result = await controller.getStats(req);

      expect(leadsService.findActivePipeline).toHaveBeenCalledWith('user1', 5);
      expect(leadsService.calculatePotentialGains).toHaveBeenCalledWith(
        'user1',
      );
      expect(result.activePipeline).toHaveLength(1);
      expect(result.potentialGains).toBe(5000);
      expect(result.activePipeline[0].company).toBe('Test Corp');
    });
  });
});
