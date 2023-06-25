import { z } from 'zod';

export const Email = z.string().email().brand('Email');
export type Email = z.infer<typeof Email>;

export const Password = z.string().min(6).brand<'Password'>();
export type Password = z.infer<typeof Password>;

export const HashedPassword = z.string().length(60).brand<'HashedPassword'>();
export type HashedPassword = z.infer<typeof HashedPassword>;
