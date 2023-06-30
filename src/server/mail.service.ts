import { ENV } from '@/env.mjs';
import { Resend } from 'resend';

export const resend = new Resend(ENV.RESEND_API_KEY);
