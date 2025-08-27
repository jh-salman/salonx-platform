import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import pino from 'pino';
import { env } from '@repo/config/env';
import { setupObservability } from './observability';
import { reminderQueue, emailQueue, smsQueue } from './queues';
import { processReminder } from './jobs/reminder';
import { processEmailCampaign } from './jobs/email-campaign';
import { processSmsCampaign } from './jobs/sms-campaign';

const logger = pino({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  transport: env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: { colorize: true }
  } : undefined,
});

setupObservability();

const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
});

const reminderWorker = new Worker('reminder', processReminder, {
  connection: redis,
  concurrency: 5,
});

const emailWorker = new Worker('email', processEmailCampaign, {
  connection: redis,
  concurrency: 3,
});

const smsWorker = new Worker('sms', processSmsCampaign, {
  connection: redis,
  concurrency: 2,
});

reminderWorker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, error: err }, 'Reminder job failed');
});

emailWorker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, error: err }, 'Email job failed');
});

smsWorker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, error: err }, 'SMS job failed');
});

reminderWorker.on('completed', (job) => {
  logger.info({ jobId: job.id }, 'Reminder job completed');
});

emailWorker.on('completed', (job) => {
  logger.info({ jobId: job.id }, 'Email job completed');
});

smsWorker.on('completed', (job) => {
  logger.info({ jobId: job.id }, 'SMS job completed');
});

process.on('SIGTERM', async () => {
  logger.info('Shutting down workers...');
  
  await Promise.all([
    reminderWorker.close(),
    emailWorker.close(),
    smsWorker.close(),
  ]);
  
  await redis.quit();
  process.exit(0);
});

logger.info('🚀 Workers started successfully');
logger.info(`📊 Redis connected: ${env.REDIS_URL}`);
