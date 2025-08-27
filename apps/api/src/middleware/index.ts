import type { Express } from 'express';
import { authMiddleware } from './auth';
import { rateLimitMiddleware } from './rate-limit';
import { auditMiddleware } from './audit';
import { tenancyMiddleware } from './tenancy';

export function setupMiddleware(app: Express) {
  app.use(rateLimitMiddleware);
  
  app.use('/admin', authMiddleware);
  
  app.use(tenancyMiddleware);
  
  app.use(auditMiddleware);
}

export * from './auth';
export * from './rate-limit';
export * from './audit';
export * from './tenancy';
export * from './validation';
