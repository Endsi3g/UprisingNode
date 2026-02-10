import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Module, Global } from '@nestjs/common';

@Global()
@Module({
  providers: [{
      provide: PrismaService,
      useValue: { user: { findUnique: jest.fn() } },
  }],
  exports: [PrismaService],
})
class MockPrismaModule {}

describe('AuthModule Security', () => {

  it('should THROW an error when JWT_SECRET is missing', async () => {
    // Clear env var
    delete process.env.JWT_SECRET;

    await expect(Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MockPrismaModule,
        AuthModule
      ],
    }).compile()).rejects.toThrow();
  });

  it('should initialize correctly when JWT_SECRET is present', async () => {
    process.env.JWT_SECRET = 'valid-secret-key-for-testing';

    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MockPrismaModule,
        AuthModule
      ],
    }).compile();

    const jwtService = module.get<JwtService>(JwtService);
    expect(jwtService).toBeDefined();

    // Verify it uses the correct secret
    const token = jwtService.sign({ sub: 'test' });
    expect(() => jwtService.verify(token, { secret: 'valid-secret-key-for-testing' })).not.toThrow();
    // It should fail with wrong secret
    expect(() => jwtService.verify(token, { secret: 'wrong-secret' })).toThrow();
  });
});
