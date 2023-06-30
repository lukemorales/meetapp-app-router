import { z } from 'zod';

export const Email = z.string().email().brand('Email');
export type Email = z.infer<typeof Email>;

export const Password = z.string().min(6).brand('Password');
export type Password = z.infer<typeof Password>;

export const EncryptedPassword = z
  .string()
  .length(60)
  .brand('EncryptedPassword');
export type EncryptedPassword = z.infer<typeof EncryptedPassword>;
