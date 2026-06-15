import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';

@Injectable()
export class CompanyContextGuard implements CanActivate {
  private readonly logger = new Logger(CompanyContextGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const companyId = request.headers['x-company-id'] || 'company-1';
    const userId = request.headers['x-user-id'] || 'user-1';

    if (!companyId) {
      return false;
    }

    // Attach to BOTH request and request.raw
    // Fastify sometimes reads from one, sometimes the other
    request.companyId = companyId;
    request.userId = userId;
    if (request.raw) {
      request.raw.companyId = companyId;
      request.raw.userId = userId;
    }

    this.logger.log({
      message: 'Company context attached',
      requestId: request.requestId,
      companyId,
      userId,
    });

    return true;
  }
}