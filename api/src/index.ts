import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { Application, Request, Response } from 'express';

// Use a singleton pattern to cache the app instance across invocations
let appPromise: Promise<Application> | null = null;

async function bootstrap(): Promise<Application> {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Adjust for production security later
    credentials: true,
  });
  await app.init();
  return app.getHttpAdapter().getInstance() as Application;
}

export default async function handler(req: Request, res: Response) {
  if (!appPromise) {
    appPromise = bootstrap();
  }
  const expressApp = await appPromise;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return expressApp(req, res);
}
