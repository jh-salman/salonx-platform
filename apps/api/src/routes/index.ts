import type { Express } from 'express';
import { publicRoutes } from './public.js';
import { adminRoutes } from './admin.js';

export function setupRoutes(app: Express) {
  app.use('/public', publicRoutes);
  
  app.use('/admin', adminRoutes);
  
  app.use('/v1/public', publicRoutes);
  app.use('/v1/admin', adminRoutes);
}
