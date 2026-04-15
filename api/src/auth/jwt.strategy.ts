import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    const env = configService.get<string>('NODE_ENV');

    if (!secret && env !== 'test') {
      throw new Error(
        'JWT_SECRET environment variable is missing. Authentication cannot be secured without it.',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret || 'test-secret',
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(payload: { sub: string; email: string; role: string }) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
