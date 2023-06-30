import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { ENV } from '@/env.mjs';

import * as schema from './schema';
import { formatDbSchema } from './utils';

function createConnectionString() {
  return `postgres://${ENV.PG_USER}:${ENV.PG_PASSWORD}@${ENV.PG_HOST}/${ENV.PG_DATABASE}`;
}

export const db = drizzle(
  new Pool({ connectionString: createConnectionString() }),
  { schema: formatDbSchema(schema) },
);
