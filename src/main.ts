import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER!],
        ssl: {
          rejectUnauthorized: true,
          ca: [fs.readFileSync('./certs/ca.pem', 'utf-8')],
          key: fs.readFileSync('./certs/service.key', 'utf-8'),
          cert: fs.readFileSync('./certs/service.cert', 'utf-8'),
        },
      },
      consumer: {
        groupId: process.env.KAFKA_GROUP_ID!,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
