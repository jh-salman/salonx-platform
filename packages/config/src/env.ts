import { z } from 'zod';
import { config } from 'dotenv';

config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.string().default('3001'),
  
  DATABASE_URL: z.string().default('postgresql://localhost:5432/salonx_dev'),
  
  REDIS_URL: z.string().default('redis://localhost:6379'),
  
  JWT_SECRET: z.string().default('your-jwt-secret-change-in-production'),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  
  POSTMARK_API_TOKEN: z.string().optional(),
  SENDGRID_API_KEY: z.string().optional(),
  
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),
  
  SENTRY_DSN: z.string().optional(),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().optional(),
  
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default('us-east-1'),
  AWS_S3_BUCKET: z.string().optional(),
  
  FAST_MODE_ENABLED: z.string().transform(val => val === 'true').default('false'),
  REMINDER_OFFSET_SECONDS: z.string().transform(val => parseInt(val, 10)).default('86400'), // 24 hours
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
