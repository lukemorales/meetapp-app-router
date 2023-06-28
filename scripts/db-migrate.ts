/* eslint-disable no-console */
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { db } from '@/database/db';

migrate(db, { migrationsFolder: './src/database/migrations' })
  .then(() => console.log('✅ Run migrations to the database'))
  .catch((err: Error) =>
    console.log('❌ Failed to run migrations', err.message),
  );
