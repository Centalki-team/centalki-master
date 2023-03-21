import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import admin from 'firebase-admin';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
// import { ErrorsInterceptor } from './interceptors/errors.interceptor';
// import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { SentryExceptionsFilter } from './filters/sentry-exception.filter';

const configureBucketCors = async (app) => {
  const configService: ConfigService = app.get(ConfigService);

  return admin
    .storage()
    .bucket(configService.get<string>('BUCKET_NAME'))
    .setCorsConfiguration([
      {
        origin: ['*'],
        responseHeader: ['Content-Type'],
        method: ['GET', 'HEAD', 'DELETE'],
        maxAgeSeconds: 3600,
      },
    ]);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  const config = new DocumentBuilder()
    .setTitle('Centalki')
    .setDescription('The centalki API description')
    .setVersion('1.0')
    // .addServer('/centalki-staging/us-central1/api')
    .addTag('Centalki')
    .addBearerAuth({
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const swaggerCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: { displayRequestDuration: true },
  };
  SwaggerModule.setup('api-docs', app, document, swaggerCustomOptions);

  const configService = app.get<ConfigService>(ConfigService);

  // app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new SentryExceptionsFilter());

  const port = configService.getOrThrow('port');
  Sentry.init({
    dsn: configService.getOrThrow('sentryDNS'),
  });
  await configureBucketCors(app);
  await app.listen(port, '0.0.0.0');
  console.log(`Centalki Master listening on http port: ${port}`);
  console.log(`Env: ${process.env.NODE_ENV}`);
}
bootstrap();
