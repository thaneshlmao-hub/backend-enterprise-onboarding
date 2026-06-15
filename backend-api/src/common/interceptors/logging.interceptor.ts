import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { method, url, requestId } = request;
    const startTime = Date.now();

    // ── BEFORE the controller runs ──
    this.logger.log({
      message: 'Incoming request',
      requestId,
      method,
      path: url,
    });

    return next.handle().pipe(
      // ── AFTER the controller runs ──
      tap(() => {
        const responseTimeMs = Date.now() - startTime;
        const statusCode = response.statusCode;

        this.logger.log({
          message: 'Request completed',
          requestId,
          method,
          path: url,
          statusCode,
          responseTimeMs,
        });
      }),
    );
  }
}