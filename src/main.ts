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
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const server_port = configService.get('server_port');

  app.useGlobalPipes(new ValidationPipe());

  await createSwaggerDocument(app);

  await app.listen(server_port);
}

bootstrap();
