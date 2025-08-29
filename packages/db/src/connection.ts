import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index.js';

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/salonx_dev';

console.log('Database connection string configured:', connectionString ? 'Yes' : 'No');
console.log('Using connection string:', connectionString.replace(/:[^:@]*@/, ':***@'));

const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
export { client as connection };
