import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');

  const config = new DocumentBuilder()
    .setTitle('Centalki')
    .setDescription('The centalki API description')
    .setVersion('1.0')
    // .addServer('/centalki-staging/us-central1/api')
    .addTag('Centalki')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(3000);
  console.log(`Centalki Master listening on http port ${3000}`);
}
bootstrap();
