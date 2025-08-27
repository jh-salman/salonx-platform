import { Queue } from 'bullmq';
import { Redis } from 'ioredis';
import { env } from '@repo/config/env';

const redis = new Redis(env.REDIS_URL);

export const reminderQueue = new Queue('reminder', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

export const emailQueue = new Queue('email', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 50,
    removeOnFail: 25,
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
});

export const smsQueue = new Queue('sms', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 50,
    removeOnFail: 25,
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 3000,
    },
  },
});

export async function scheduleReminder(appointmentId: string, sendAt: Date) {
  const delay = sendAt.getTime() - Date.now();
  
  if (delay > 0) {
    await reminderQueue.add(
      'send-reminder',
      { appointmentId },
      { delay }
    );
  }
}

export async function scheduleEmailCampaign(campaignId: string, sendAt?: Date) {
  const jobOptions = sendAt ? { delay: sendAt.getTime() - Date.now() } : {};
  
  await emailQueue.add(
    'send-email-campaign',
    { campaignId },
    jobOptions
  );
}

export async function scheduleSmsCampaign(campaignId: string, sendAt?: Date) {
  const jobOptions = sendAt ? { delay: sendAt.getTime() - Date.now() } : {};
  
  await smsQueue.add(
    'send-sms-campaign',
    { campaignId },
    jobOptions
  );
}
