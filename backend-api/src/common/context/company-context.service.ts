import {
  Injectable,
  Scope,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

// Scope.REQUEST = a brand new instance is created for EVERY request
// This is what makes it safe to store per-request data here
// One request's companyId can NEVER leak into another request
@Injectable({ scope: Scope.REQUEST })
export class CompanyContextService {
  constructor(@Inject(REQUEST) private readonly request: any) {}

  get companyId(): string {
    // Fastify stores custom properties on both request and request.raw
    // We check both to be safe
    const companyId =
      this.request.companyId ||
      this.request.raw?.companyId;

    if (!companyId) {
      throw new BadRequestException(
        'Company context not available — request missing company information',
      );
    }
    return companyId;
  }

  get userId(): string {
    const userId =
      this.request.userId ||
      this.request.raw?.userId ||
      'user-1'; // temporary default until Day 6 JWT auth
    return userId;
  }
}