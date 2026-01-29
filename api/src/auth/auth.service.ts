import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from './password.service';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  // In-memory token store (for production, use Redis or database)
  private resetTokens: Map<string, { userId: string; expiresAt: Date }> =
    new Map();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if user exists
    const existing: User | null = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    const hashedPassword = await this.passwordService.hashPassword(
      dto.password,
    );

    // Create user
    const user: User = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        role: 'PARTNER',
      },
    });

    return this.generateToken(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user: User | null = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordService.comparePassword(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user.id, user.email, user.role);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user: User | null = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Always return success for security (don't reveal if email exists)
    if (!user) {
      return {
        message:
          'If an account exists with this email, a reset link has been sent.',
      };
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour expiry

    // Store token (in production, store in DB or Redis)
    this.resetTokens.set(token, { userId: user.id, expiresAt });

    // TODO: Send email with reset link
    // In production: await this.emailService.sendPasswordResetEmail(user.email, token);
    console.log(`Password reset token for ${user.email}: ${token}`);

    return {
      message:
        'If an account exists with this email, a reset link has been sent.',
      // For development only - remove in production:
      ...(process.env.NODE_ENV !== 'production' && { token }),
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenData = this.resetTokens.get(dto.token);

    if (!tokenData) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (new Date() > tokenData.expiresAt) {
      this.resetTokens.delete(dto.token);
      throw new BadRequestException('Reset token has expired');
    }

    // Hash new password
    const hashedPassword = await this.passwordService.hashPassword(
      dto.newPassword,
    );

    // Update user password
    await this.prisma.user.update({
      where: { id: tokenData.userId },
      data: { password: hashedPassword },
    });

    // Remove used token
    this.resetTokens.delete(dto.token);

    return { message: 'Password has been reset successfully' };
  }

  private generateToken(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: userId,
        email: email,
        role: role,
      },
    };
  }
}
