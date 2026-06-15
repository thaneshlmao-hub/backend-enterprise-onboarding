import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const requestId = randomUUID();

    // Attach to both req and req.raw
    // Fastify wraps the raw Node.js request in req.raw
    // NestJS sometimes reads from one, sometimes the other
    req.requestId = requestId;
    if (req.raw) {
      req.raw.requestId = requestId;
    }

    res.setHeader('X-Request-Id', requestId);
    next();
  }
}