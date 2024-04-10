import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, VersioningType } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function createSwaggerDocument(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('MarketGuru Test')
    .setDescription(
      '<img src="https://static.wikia.nocookie.net/6b513aac-f732-4648-a6a4-63d74e4aa59a" alt="Хто я?" width="100%" height="600">',
    )
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

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await createSwaggerDocument(app);

  await app.listen(serverPort);
}

bootstrap();
