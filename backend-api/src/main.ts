import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { validateEnv } from './env.validation';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { CompanyContextGuard } from './common/guards/company-context.guard';

async function bootstrap() {
  // Step 1 - Validate environment variables first
  validateEnv();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Step 2 - Global Exception Filter (must be first)
  // Catches ALL unhandled errors across the entire app
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Step 3 - Global Guard
  // Extracts companyId and attaches to every request
  app.useGlobalGuards(new CompanyContextGuard());

  // Step 4 - Global Interceptor
  // Logs every request and response with timing
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Step 5 - Global Validation Pipe
  // Validates all DTOs on every request
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Step 6 - Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Backend Enterprise Onboarding API')
    .setDescription('Day 4 - Request Pipeline, Guards & Interceptors')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001, '0.0.0.0');
  console.log('App running on http://localhost:3001');
  console.log('Swagger docs at http://localhost:3001/api');
}
bootstrap();