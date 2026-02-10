import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userId = request.user?.userId;

    const key = super.trackBy(context);

    // If cache key is undefined (e.g. POST request), don't cache
    if (!key) {
      return undefined;
    }

    // If user is authenticated, namespace the cache key with the user ID
    if (userId) {
      return `user:${userId}:${key}`;
    }

    return key;
  }
}
