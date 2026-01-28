import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './password.service';
import { UnauthorizedException, ConflictException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let passwordService: PasswordService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(() => 'mock-token'),
  };

  const mockPasswordService = {
    hashPassword: jest.fn(() => Promise.resolve('hashed')),
    comparePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: PasswordService, useValue: mockPasswordService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    passwordService = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const dto = { email: 'test@test.com', password: 'pass', name: 'Test' };
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: '1',
        ...dto,
        role: 'PARTNER',
      });

      const result = await service.register(dto);
      expect(result).toHaveProperty('access_token');
      expect(prisma.user.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if user exists', async () => {
      const dto = { email: 'test@test.com', password: 'pass', name: 'Test' };
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1' });

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login valid user', async () => {
      const dto = { email: 'test@test.com', password: 'pass' };
      const user = { id: '1', email: 'test@test.com', password: 'hashed', role: 'PARTNER' };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockPasswordService.comparePassword.mockResolvedValue(true);

      const result = await service.login(dto);
      expect(result).toHaveProperty('access_token');
    });

    it('should throw UnauthorizedException on invalid password', async () => {
      const dto = { email: 'test@test.com', password: 'wrong' };
      const user = { id: '1', email: 'test@test.com', password: 'hashed' };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockPasswordService.comparePassword.mockResolvedValue(false);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
