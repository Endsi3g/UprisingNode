import { Module, Logger } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PasswordService } from './password.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        let secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          if (configService.get<string>('NODE_ENV') === 'production') {
            throw new Error(
              'FATAL: JWT_SECRET is not defined in production environment!',
            );
          }
          const logger = new Logger('AuthModule');
          logger.warn(
            'JWT_SECRET not found. Using unsafe default "secret". This is unsafe for production!',
          );
          secret = 'secret';
        }
        return {
          secret: secret,
          signOptions: { expiresIn: '7d' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    PasswordService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService, PasswordService],
})
export class AuthModule {}
