/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export default async function handler(req: any, res: any) {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Adjust for production security later
    credentials: true,
  });
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp(req, res);
}
