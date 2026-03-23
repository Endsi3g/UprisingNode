import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { Request, Response } from 'express';

export default async function handler(
  req: Request,
  res: Response,
): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Adjust for production security later
    credentials: true,
  });
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance() as (
    req: Request,
    res: Response,
  ) => void;
  expressApp(req, res);
}
