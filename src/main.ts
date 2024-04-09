import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';

async function createSwaggerDocument(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('MarketGuru Test')
    .setDescription('MarketGuru Test API description')
    .setVersion('1.0')
    .addTag('MG API')
    .addBearerAuth({
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      bearerFormat: 'Bearer',
      description:
        'Полученный токен следует добавлять в каждый запрос, ' +
        'который требует авторизацию, прибавляя к запросу заголовок ' +
        '(http-header) ' +
        '<code>Authorization: Bearer <токен></code>',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const serverPort = configService.get('serverPort');

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await createSwaggerDocument(app);

  await app.listen(serverPort);
}

bootstrap();
