import type { Request, Response, NextFunction } from 'express';
import { db } from '@repo/db';
import { auditLogs } from '@repo/db/schema';
import type { AuthenticatedRequest } from './auth.js';

export function auditMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.path === '/health' || req.path.startsWith('/static')) {
    return next();
  }

  if (!req.user || req.method === 'GET') {
    return next();
  }

  const originalSend = res.send;
  
  res.send = function(data) {
    setImmediate(async () => {
      try {
        await db.insert(auditLogs).values({
          orgId: req.user!.orgId,
          userId: req.user!.id,
          action: `${req.method} ${req.path}`,
          entityType: extractEntityType(req.path),
          entityId: extractEntityId(req.path, req.params),
          newValues: req.method !== 'DELETE' ? req.body : undefined,
          metadata: {
            userAgent: req.get('User-Agent'),
            requestId: req.get('X-Request-ID'),
            statusCode: res.statusCode,
          },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
        });
      } catch (error) {
        console.error('Failed to log audit entry:', error);
      }
    });

    return originalSend.call(this, data);
  };

  next();
}

function extractEntityType(path: string): string {
  const segments = path.split('/').filter(Boolean);
  if (segments.length >= 2 && segments[1]) {
    return segments[1]; // e.g., /admin/appointments -> appointments
  }
  return 'unknown';
}

function extractEntityId(path: string, params: any): string | undefined {
  const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
  const match = path.match(uuidRegex);
  if (match) {
    return match[0];
  }
  
  return params.id || params.appointmentId || params.clientId || params.serviceId;
}
