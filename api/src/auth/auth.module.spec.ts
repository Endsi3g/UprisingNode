import { Test } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('AuthModule', () => {
  it('should compile with JWT_SECRET', async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          load: [() => ({ JWT_SECRET: 'test-secret' })],
        }),
        PrismaModule,
        AuthModule,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue({
        user: { findUnique: jest.fn() },
      })
      .compile();

    expect(module).toBeDefined();
  });

  it('should fail without JWT_SECRET', async () => {
    await expect(
      Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
            load: [() => ({})], // No secret
          }),
          PrismaModule,
          AuthModule,
        ],
      })
        .overrideProvider(PrismaService)
        .useValue({})
        .compile(),
    ).rejects.toThrow();
  });
});
