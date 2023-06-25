import 'server-only';

import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { db } from './db';

export * from './db';
export * from './schema';

let hasMigrated = false;

if (!hasMigrated) {
  migrate(db, { migrationsFolder: './src/database/migrations' })
    .then(() => {
      hasMigrated = true;
      console.log('✅ Run migrations to the database');
    })
    .catch((err) => console.log('❌ Failed to run migrations', err));
}
