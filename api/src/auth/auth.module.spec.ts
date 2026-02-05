import { Test } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [{ provide: PrismaService, useValue: {} }],
  exports: [PrismaService],
})
class MockPrismaModule {}

describe('AuthModule', () => {
  it('should compile the module when JWT_SECRET is provided', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        MockPrismaModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => ({ JWT_SECRET: 'test_secret' })],
        }),
        AuthModule,
      ],
    }).compile();

    expect(moduleRef).toBeDefined();
  });

  it('should fail to compile/init when JWT_SECRET is missing', async () => {
    try {
      await Test.createTestingModule({
        imports: [
          MockPrismaModule,
          ConfigModule.forRoot({
            isGlobal: true,
            load: [() => ({})], // Empty config
          }),
          AuthModule,
        ],
      }).compile();

      throw new Error('Should have thrown an error');
    } catch (error: any) {
      expect(error.message).toContain('JWT_SECRET is not defined');
    }
  });
});
