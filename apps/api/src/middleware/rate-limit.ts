import type { Request, Response, NextFunction } from 'express';
import { createClient } from 'redis';
import { env } from '@repo/config/env';
import { RATE_LIMITS } from '@repo/config/constants';

const redis = createClient({ url: env.REDIS_URL });

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: Request) => string;
}

function createRateLimiter(options: RateLimitOptions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = options.keyGenerator ? options.keyGenerator(req) : req.ip;
    const redisKey = `rate_limit:${key}`;
    
    try {
      const current = await redis.incr(redisKey);
      
      if (current === 1) {
        await redis.expire(redisKey, Math.ceil(options.windowMs / 1000));
      }
      
      if (current > options.maxRequests) {
        return res.status(429).json({
          success: false,
          error: 'Too many requests',
          retryAfter: Math.ceil(options.windowMs / 1000),
        });
      }
      
      res.set({
        'X-RateLimit-Limit': options.maxRequests.toString(),
        'X-RateLimit-Remaining': Math.max(0, options.maxRequests - current).toString(),
        'X-RateLimit-Reset': new Date(Date.now() + options.windowMs).toISOString(),
      });
      
      next();
    } catch (error) {
      console.error('Rate limiting error:', error);
      next();
    }
  };
}

export const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/public/appointments')) {
    return createRateLimiter({
      windowMs: RATE_LIMITS.BOOKING.WINDOW_MS,
      maxRequests: RATE_LIMITS.BOOKING.MAX_REQUESTS,
    })(req, res, next);
  }
  
  if (req.path.startsWith('/admin')) {
    return createRateLimiter({
      windowMs: RATE_LIMITS.ADMIN_API.WINDOW_MS,
      maxRequests: RATE_LIMITS.ADMIN_API.MAX_REQUESTS,
      keyGenerator: (req) => (req as any).user?.id || req.ip,
    })(req, res, next);
  }
  
  return createRateLimiter({
    windowMs: RATE_LIMITS.PUBLIC_API.WINDOW_MS,
    maxRequests: RATE_LIMITS.PUBLIC_API.MAX_REQUESTS,
  })(req, res, next);
};
