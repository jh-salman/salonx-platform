import type { Express } from 'express';
import { authMiddleware } from './auth.js';
import { rateLimitMiddleware } from './rate-limit.js';
import { auditMiddleware } from './audit.js';
import { tenancyMiddleware } from './tenancy.js';

export function setupMiddleware(app: Express) {
  app.use(rateLimitMiddleware);
  
  app.use('/admin', authMiddleware);
  
  app.use(tenancyMiddleware);
  
  app.use(auditMiddleware);
}

export * from './auth.js';
export * from './rate-limit.js';
export * from './audit.js';
export * from './tenancy.js';
export * from './validation.js';
