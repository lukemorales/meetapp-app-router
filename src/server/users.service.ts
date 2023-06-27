import { db, usersTable } from '@/database';
import { UserId } from '@/shared/entity-ids';
import { EncryptedPassword, Password } from '@/shared/validation';
import { hash } from 'bcryptjs';
import { InferModel } from 'drizzle-orm';
import { User } from 'next-auth';
import { ulid } from 'ulid';

type CreateUserOptions = Pick<
  InferModel<typeof usersTable, 'insert'>,
  'name' | 'email'
> & {
  password: Password;
};

export async function createUser(options: CreateUserOptions): Promise<User> {
  const { password, ...values } = options;

  return db
    .insert(usersTable)
    .values({
      ...values,
      id: UserId.parse(ulid()),
      passwordHash: EncryptedPassword.parse(await hash(password, 10)),
    })
    .returning({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      updatedAt: usersTable.updatedAt,
      createdAt: usersTable.createdAt,
    })
    .then(([user]) => user);
}
