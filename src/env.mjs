// @ts-check

import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const ENV = createEnv({
  server: {
    PG_HOST: z.string().min(1),
    PG_DATABASE: z.string().min(1),
    PG_USER: z.string().min(1),
    PG_PASSWORD: z.string().min(1),
    NEXTAUTH_URL: z.string().min(1),
    NEXTAUTH_SECRET: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
  },
  shared: {
    NODE_ENV: z.enum(['development', 'production', 'test']),
  },
  experimental__runtimeEnv: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV,
  },
});
