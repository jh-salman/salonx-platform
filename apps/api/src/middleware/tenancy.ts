import type { Request, Response, NextFunction } from 'express';
import { db } from '@repo/db';
import { brands } from '@repo/db/schema';
import { eq } from 'drizzle-orm';
import type { AuthenticatedRequest } from './auth.js';

export interface TenantRequest extends AuthenticatedRequest {
  brand?: {
    id: string;
    orgId: string;
    slug: string;
    name: string;
  };
}

export function tenancyMiddleware(req: TenantRequest, res: Response, next: NextFunction) {
  if (req.path.startsWith('/public')) {
    return resolveBrandFromHost(req, res, next);
  }

  if (req.path.startsWith('/admin') && req.user) {
    return resolveBrandFromUser(req, res, next);
  }

  next();
}

async function resolveBrandFromHost(req: TenantRequest, res: Response, next: NextFunction) {
  try {
    const host = req.get('host') || req.get('x-forwarded-host') || '';
    
    const subdomain = host.split('.')[0];
    
    if (!subdomain || subdomain === 'www' || subdomain === 'api') {
      return res.status(400).json({
        success: false,
        error: 'Invalid brand subdomain',
      });
    }

    const brand = await db
      .select({
        id: brands.id,
        orgId: brands.orgId,
        slug: brands.slug,
        name: brands.name,
      })
      .from(brands)
      .where(eq(brands.slug, subdomain))
      .limit(1);

    if (!brand.length) {
      return res.status(404).json({
        success: false,
        error: 'Brand not found',
      });
    }

    req.brand = brand[0];
    next();
  } catch (error) {
    console.error('Failed to resolve brand from host:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to resolve brand',
    });
  }
}

async function resolveBrandFromUser(req: TenantRequest, res: Response, next: NextFunction) {
  try {
    const brandId = req.query.brandId as string;
    
    if (brandId) {
      const brand = await db
        .select({
          id: brands.id,
          orgId: brands.orgId,
          slug: brands.slug,
          name: brands.name,
        })
        .from(brands)
        .where(eq(brands.id, brandId))
        .limit(1);

      if (!brand.length) {
        return res.status(404).json({
          success: false,
          error: 'Brand not found',
        });
      }

      if (!brand[0] || brand[0].orgId !== req.user!.orgId) {
        return res.status(403).json({
          success: false,
          error: 'Access denied to this brand',
        });
      }

      req.brand = brand[0];
    }

    next();
  } catch (error) {
    console.error('Failed to resolve brand from user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to resolve brand',
    });
  }
}
