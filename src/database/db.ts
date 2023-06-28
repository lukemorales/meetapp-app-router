import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

import * as schema from './schema';
import { formatDbSchema } from './utils';

export const db = drizzle(
  new Pool({ connectionString: process.env.PG_CONNECTION }),
  { schema: formatDbSchema(schema) },
);
