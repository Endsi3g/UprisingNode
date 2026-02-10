
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ExecutionContext } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import request from 'supertest';
import { DashboardController } from '../../src/dashboard/dashboard.controller';
import { TransactionsService } from '../../src/transactions/transactions.service';
import { LeadsService } from '../../src/leads/leads.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';

describe('DashboardController Performance Benchmark', () => {
  let app: INestApplication;

  // Mock implementations with artificial latency to simulate DB calls
  const mockTransactionsService = {
    getTotalEarnings: jest.fn().mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 50)); // 50ms simulated DB latency
      return 1000;
    }),
  };

  const mockLeadsService = {
    findAll: jest.fn().mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 50)); // 50ms simulated DB latency
      return [
        {
          id: '1',
          companyName: 'Test Co',
          status: 'ANALYSIS',
          createdAt: new Date(),
          score: 5
        }
      ];
    }),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn().mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 20)); // 20ms simulated DB latency
        return { id: 'user1', role: 'USER', emailVerified: true };
      }),
    },
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register({ ttl: 10000 })],
      controllers: [DashboardController],
      providers: [
        { provide: TransactionsService, useValue: mockTransactionsService },
        { provide: LeadsService, useValue: mockLeadsService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({
      canActivate: (context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        req.user = { userId: 'user1', email: 'test@test.com', role: 'USER' };
        return true;
      },
    })
    .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('measures execution time of getStats via HTTP', async () => {
    const iterations = 20;
    const times: number[] = [];

    console.log(`\nStarting benchmark: ${iterations} iterations...`);

    // Warmup request (ensures module is loaded)
    await request(app.getHttpServer()).get('/dashboard/stats');

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await request(app.getHttpServer()).get('/dashboard/stats');
      const end = performance.now();
      times.push(end - start);
    }

    const totalTime = times.reduce((a, b) => a + b, 0);
    const avgTime = totalTime / times.length;

    console.log(`\nResults:`);
    console.log(`Total Time: ${totalTime.toFixed(2)}ms`);
    console.log(`Average Time per Request: ${avgTime.toFixed(2)}ms`);
    console.log(`Min Time: ${Math.min(...times).toFixed(2)}ms`);
    console.log(`Max Time: ${Math.max(...times).toFixed(2)}ms`);
  });
});
