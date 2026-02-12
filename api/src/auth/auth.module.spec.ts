/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { Module, Global } from '@nestjs/common';

@Global()
@Module({
  providers: [{ provide: PrismaService, useValue: {} }],
  exports: [PrismaService],
})
class MockPrismaModule {}

describe('AuthModule', () => {
  it('should fail if JWT_SECRET is missing', async () => {
    // With MockPrismaModule, dependency injection should work.
    // So if this fails, it should be because of JWT_SECRET (after we make changes).
    // BEFORE changes: This should NOT throw (unless some other error), so expect(...).rejects.toThrow() should FAIL.

    await expect(
      Test.createTestingModule({
        imports: [
          AuthModule,
          MockPrismaModule,
          ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
            load: [() => ({})], // No JWT_SECRET
          }),
        ],
      }).compile(),
    ).rejects.toThrow();
  });

  it('should compile if JWT_SECRET is present', async () => {
    const module = await Test.createTestingModule({
      imports: [
        AuthModule,
        MockPrismaModule,
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          load: [() => ({ JWT_SECRET: 'test-secret' })],
        }),
      ],
    }).compile();

    expect(module).toBeDefined();
  });
});
