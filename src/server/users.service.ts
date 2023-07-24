import { db, usersTable } from '@/database';
import { A, O, FX } from '@/shared/effect';
import { comparePassword, encryptPassword } from '@/shared/encryption';
import { UserId } from '@/shared/entity-ids';
import { type Password } from '@/shared/validation';
import { eq, type InferModel } from 'drizzle-orm';
import { pipe } from 'effect';
import { ulid } from 'ulid';

type CreateUserOptions = Pick<
  InferModel<typeof usersTable, 'insert'>,
  'name' | 'email'
> & {
  password: Password;
};

export function createUser(options: CreateUserOptions) {
  const { password, ...values } = options;

  return pipe(
    FX.promise(async () =>
      db
        .insert(usersTable)
        .values({
          ...values,
          id: UserId.parse(ulid()),
          passwordHash: await encryptPassword(password).pipe(FX.runPromise),
        })
        .returning({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          updatedAt: usersTable.updatedAt,
          createdAt: usersTable.createdAt,
        }),
    ),
    FX.flatMap(A.head),
  );
}

type UpdateUserOptions = Omit<CreateUserOptions, 'password'> & {
  password?: Password;
  newPassword?: Password;
};

export function updateUser(userId: UserId, options: UpdateUserOptions) {
  return pipe(
    FX.tryPromise(() =>
      db.query.users.findFirst({ where: eq(usersTable.id, userId) }),
    ),
    FX.flatMap(O.fromNullable),
    FX.flatMap((databaseUser) => {
      const { password, newPassword, ...values } = options;

      if (password && newPassword) {
        return pipe(
          comparePassword(password, databaseUser.passwordHash),
          FX.if({
            onFalse: FX.fail('Invalid password' as const),
            onTrue: pipe(
              FX.tryPromise(async () =>
                db
                  .update(usersTable)
                  .set({
                    ...values,
                    passwordHash: await encryptPassword(password).pipe(
                      FX.runPromise,
                    ),
                  })
                  .where(eq(usersTable.id, userId))
                  .returning({
                    id: usersTable.id,
                    name: usersTable.name,
                    email: usersTable.email,
                    updatedAt: usersTable.updatedAt,
                    createdAt: usersTable.createdAt,
                  }),
              ),
            ),
          }),
          FX.flatMap(A.head),
        );
      }

      return pipe(
        FX.tryPromise(() =>
          db
            .update(usersTable)
            .set(values)
            .where(eq(usersTable.id, userId))
            .returning({
              id: usersTable.id,
              name: usersTable.name,
              email: usersTable.email,
              updatedAt: usersTable.updatedAt,
              createdAt: usersTable.createdAt,
            }),
        ),
        FX.flatMap(A.head),
      );
    }),
  );

  // const databaseUser = await db.query.users.findFirst({
  //   where: eq(usersTable.id, userId),
  // });

  // if (!databaseUser) {
  //   notFound();
  // }

  // const { password, newPassword, ...values } = options;

  // if (password && newPassword) {
  //   const isSamePassword = await comparePassword(
  //     password,
  //     databaseUser.passwordHash,
  //   );

  //   if (!isSamePassword) {
  //     return E.left('Invalid password');
  //   }

  //   return db
  //     .update(usersTable)
  //     .set({
  //       ...values,
  //       passwordHash: await encryptPassword(password),
  //     })
  //     .where(eq(usersTable.id, userId))
  //     .returning({
  //       id: usersTable.id,
  //       name: usersTable.name,
  //       email: usersTable.email,
  //       updatedAt: usersTable.updatedAt,
  //       createdAt: usersTable.createdAt,
  //     })
  //     .then(([user]) => E.right(user));
  // }

  // return db
  //   .update(usersTable)
  //   .set(values)
  //   .where(eq(usersTable.id, userId))
  //   .returning({
  //     id: usersTable.id,
  //     name: usersTable.name,
  //     email: usersTable.email,
  //     updatedAt: usersTable.updatedAt,
  //     createdAt: usersTable.createdAt,
  //   })
  //   .then(([user]) => E.right(user));
}
