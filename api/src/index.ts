import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Adjust for production security later
    credentials: true,
  });
  await app.init();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const expressApp: (req: Request, res: Response) => void = app
    .getHttpAdapter()
    .getInstance();
  return expressApp(req, res);
}
