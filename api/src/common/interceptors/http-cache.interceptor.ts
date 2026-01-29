import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const { httpAdapter } = this.httpAdapterHost;
    const isHttpApp = httpAdapter && !!httpAdapter.getRequestMethod;
    const cacheKey = super.trackBy(context);

    if (!isHttpApp || !cacheKey) {
      return cacheKey;
    }

    const userId = request.user?.userId;
    return userId ? `${cacheKey}-${userId}` : cacheKey;
  }
}
