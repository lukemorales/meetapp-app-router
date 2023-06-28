import { notFound } from 'next/navigation';

import { type User, db, usersTable } from '@/database';
import { UserId } from '@/shared/entity-ids';
import { EncryptedPassword, type Password } from '@/shared/validation';
import { hash } from 'bcryptjs';
import { type InferModel, eq } from 'drizzle-orm';
import { ulid } from 'ulid';
import * as E from '@effect/data/Either';
import { comparePassword, encryptPassword } from '@/shared/encryption';

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

type UpdateUserOptions = Omit<CreateUserOptions, 'password'> & {
  password?: Password;
  newPassword?: Password;
};

export async function updateUser(
  userId: UserId,
  options: UpdateUserOptions,
): Promise<E.Either<string, User>> {
  const databaseUser = await db.query.users.findFirst({
    where: eq(usersTable.id, userId),
  });

  if (!databaseUser) {
    notFound();
  }

  const { password, newPassword, ...values } = options;

  if (password && newPassword) {
    const isSamePassword = await comparePassword(
      password,
      databaseUser.passwordHash,
    );

    if (!isSamePassword) {
      return E.left('Invalid password');
    }

    return db
      .update(usersTable)
      .set({
        ...values,
        passwordHash: await encryptPassword(password),
      })
      .where(eq(usersTable.id, userId))
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        updatedAt: usersTable.updatedAt,
        createdAt: usersTable.createdAt,
      })
      .then(([user]) => E.right(user));
  }

  return db
    .update(usersTable)
    .set(values)
    .where(eq(usersTable.id, userId))
    .returning({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      updatedAt: usersTable.updatedAt,
      createdAt: usersTable.createdAt,
    })
    .then(([user]) => E.right(user));
}
