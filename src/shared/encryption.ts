import * as bcrypt from 'bcryptjs';
import { exhaustive } from 'exhaustive';
import { ENV } from '@/env.mjs';
import { pipe } from 'effect';

import { EncryptedPassword, type Password } from './validation';
import { FX } from './effect';

const ENCRYPTION_SALT_ROUNDS = exhaustive(ENV.NODE_ENV, {
  test: () => 1,
  development: () => 6,
  production: () => 10,
});

export function encryptPassword(password: Password) {
  return pipe(
    FX.promise(() => bcrypt.hash(password, ENCRYPTION_SALT_ROUNDS)),
    FX.map(EncryptedPassword.parse),
  );
}

export function comparePassword(password: Password, hash: EncryptedPassword) {
  return pipe(FX.promise(() => bcrypt.compare(password, hash)));
}
