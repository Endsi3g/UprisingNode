/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [
    {
      provide: PrismaService,
      useValue: {},
    },
  ],
  exports: [PrismaService],
})
class MockPrismaModule {}

describe('AuthModule', () => {
  describe('initialization', () => {
    it('should throw an error if JWT_SECRET is missing', async () => {
      await expect(
        Test.createTestingModule({
          imports: [
            ConfigModule.forRoot({
              isGlobal: true,
              ignoreEnvFile: true,
              load: [() => ({})], // Empty config
            }),
            MockPrismaModule,
            AuthModule,
          ],
        }).compile(),
      ).rejects.toThrow();
    });

    it('should compile if JWT_SECRET is provided', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
            load: [() => ({ JWT_SECRET: 'test-secret' })],
          }),
          MockPrismaModule,
          AuthModule,
        ],
      }).compile();

      expect(module).toBeDefined();
      const strategy = module.get<JwtStrategy>(JwtStrategy);
      expect(strategy).toBeDefined();
    });
  });
});
