import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Fastify stores custom properties on request.raw
    // so we check both places
    const requestId = request.requestId
      || request.raw?.requestId
      || 'no-request-id';

    this.logger.error({
      message: 'Request failed',
      requestId,
      method: request.method,
      path: request.url,
      statusCode: status,
      error: exception instanceof Error ? exception.message : 'Unknown error',
    });

    response.status(status).send({
      statusCode: status,
      message,
      requestId,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}