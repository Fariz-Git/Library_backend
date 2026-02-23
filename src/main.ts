import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function startserver() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const port = 3001;
  await app.listen(port);

  console.log(`🚀 Server running on http://localhost:${port}`);
}
startserver();