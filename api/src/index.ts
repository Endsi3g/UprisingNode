import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Application, Request, Response } from 'express';

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

export default async function handler(req: any, res: any) {
  if (!appPromise) {
    appPromise = bootstrap();
  }
  const expressApp = await appPromise;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return expressApp(req as unknown as Request, res as unknown as Response);
}
