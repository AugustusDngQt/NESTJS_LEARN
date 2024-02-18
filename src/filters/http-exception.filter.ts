import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private configService: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const _response = exception.getResponse() as Object;
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    response.status(status).json(
      isProduction
        ? {
            ..._response,
            timestamp: new Date().toISOString(),
            path: request.url,
          }
        : {
            ..._response,
            timestamp: new Date().toISOString(),
            path: request.url,
            stackTrace: exception.stack,
          },
    );
  }
}
