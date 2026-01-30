import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    let secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      if (configService.get<string>('NODE_ENV') === 'production') {
        throw new Error(
          'FATAL: JWT_SECRET is not defined in production environment!',
        );
      }
      const logger = new Logger('JwtStrategy');
      logger.warn('JWT_SECRET not found. Using unsafe default "secret".');
      secret = 'secret';
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: JwtPayload) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
