import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import ms from 'ms';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor(), new ErrorsInterceptor());

  // app.useGlobalFilters(
  //   new HttpExceptionFilter(configService),
  //   new AllExceptionsFilter(httpAdapterHost),
  // );

  app.setViewEngine('ejs');

  await app.listen(configService.get('PORT') || 3000);
}
bootstrap();
