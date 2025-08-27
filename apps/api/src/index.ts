import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { env } from '@repo/config/env';
import { setupRoutes } from './routes';
import { setupMiddleware } from './middleware';
import { setupObservability } from './observability';

const logger = pino({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  transport: env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: { colorize: true }
  } : undefined,
});

const app = express();

setupObservability();

app.use(helmet({
  contentSecurityPolicy: env.NODE_ENV === 'production',
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: env.NODE_ENV === 'development' 
    ? ['http://localhost:3000', 'http://localhost:5173']
    : process.env.ALLOWED_ORIGINS?.split(',') || [],
  credentials: true,
}));

app.use(pinoHttp({ logger }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

setupMiddleware(app);

setupRoutes(app);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Route not found',
    path: req.originalUrl,
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err, 'Unhandled error');
  
  res.status(err.status || 500).json({
    success: false,
    error: env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const port = parseInt(env.PORT, 10);

app.listen(port, '0.0.0.0', () => {
  logger.info(`🚀 API server running on port ${port}`);
  logger.info(`📊 Health check: http://localhost:${port}/health`);
});

export { app };
