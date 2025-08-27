import type { Express } from 'express';
import { publicRoutes } from './public';
import { adminRoutes } from './admin';

export function setupRoutes(app: Express) {
  app.use('/public', publicRoutes);
  
  app.use('/admin', adminRoutes);
  
  app.use('/v1/public', publicRoutes);
  app.use('/v1/admin', adminRoutes);
}
