import { migrate as drizzleMigrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './connection.js';

export async function runMigrations() {
  console.log('Running migrations...');
  await drizzleMigrate(db, { migrationsFolder: './src/migrations' });
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
