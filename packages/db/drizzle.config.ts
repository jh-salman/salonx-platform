import type { Config } from 'drizzle-kit';

export default {
  schema: './dist/schema/index.js',
  out: './src/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/salonx_dev',
  },
  verbose: true,
  strict: true,
} satisfies Config;
