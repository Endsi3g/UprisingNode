import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response, Application } from 'express';

export default async function handler(req: Request, res: Response) {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Adjust for production security later
    credentials: true,
  });
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance() as Application;
  expressApp(req, res);
}
