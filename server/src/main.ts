import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { MiscModule } from './misc/misc.module';

async function bootstrap() {
  const globalPrefix = 'api';
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('Screamfeed')
    .setDescription('The sceramfeed API description')
    .setVersion('1.0')
    .addTag('pos')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [MiscModule],
  });
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  app.use(cookieParser(configService.getOrThrow<string>('CORE_COOKIE_SECRET')));
  app.enableCors({
    origin: [
      configService.getOrThrow<string>('CLIENT_ORIGIN'),
      configService.getOrThrow<string>('CLIENT_BASE_URL'),
    ],
    credentials: true,
  });

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
