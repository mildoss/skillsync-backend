import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import * as fs from 'fs';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

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

  const config = new DocumentBuilder()
    .setTitle('SkillSync API')
    .setDescription('Documentation REST API for Job Board platform')
    .setVersion('1.0')
    .addGlobalParameters({
      name: 'x-user-id',
      in: 'header',
      required: false,
      description: 'User id',
    })
    .addGlobalParameters({
      name: 'x-user-role',
      in: 'header',
      required: false,
      description: 'User role: [APPLICANT] or [EMPLOYER]',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
