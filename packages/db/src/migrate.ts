import { migrate as drizzleMigrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index.js';

export async function runMigrations() {
  console.log('Running migrations...');
  
  const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/salonx_dev';
  console.log('Using connection string:', connectionString.replace(/:[^:@]*@/, ':***@'));
  
  const client = postgres(connectionString, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  
  const db = drizzle(client, { schema });
  
  await drizzleMigrate(db, { migrationsFolder: './src/migrations' });
  await client.end();
  console.log('Migrations completed!');
}

export { drizzleMigrate as migrate };

if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}
