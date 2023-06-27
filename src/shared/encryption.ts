import { compare, hash } from 'bcryptjs';
import { exhaustive } from 'exhaustive';
import { EncryptedPassword, Password } from './validation';

const ENCRYPTION_SALT_ROUNDS = exhaustive(process.env.NODE_ENV, {
  test: () => 1,
  development: () => 6,
  production: () => 10,
});

export async function encryptPassword(password: Password) {
  return EncryptedPassword.parse(await hash(password, ENCRYPTION_SALT_ROUNDS));
}

export function comparePassword(password: Password, hash: EncryptedPassword) {
  return compare(password, hash);
}
