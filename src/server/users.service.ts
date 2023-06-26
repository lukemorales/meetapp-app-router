import { usersTable, db } from '@/database';
import { UserId } from '@/shared/entity-ids';
import { Password, HashedPassword } from '@/shared/validation';
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
      passwordHash: HashedPassword.parse(await hash(password, 6)),
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
