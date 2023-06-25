import 'server-only';

import { InferModel } from 'drizzle-orm';
import { User, meetupsTable, usersTable } from './schema';
import { db } from './db';
import { HashedPassword, Password } from '@/shared/validation';
import { MeetupId, UserId } from '@/shared/entity-ids';
import { ulid } from 'ulid';
import { hash } from 'bcryptjs';

type CreateUserOptions = Pick<
  InferModel<typeof usersTable, 'insert'>,
  'name' | 'email'
> & {
  password: Password;
};

export async function createUser({
  password,
  ...values
}: CreateUserOptions): Promise<User> {
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

type CreateMeetupOptions = Omit<
  InferModel<typeof meetupsTable, 'insert'>,
  'id' | 'updatedAt' | 'createdAt'
>;

export async function createMeetup(options: CreateMeetupOptions) {
  return db
    .insert(meetupsTable)
    .values({
      ...options,
      id: MeetupId.parse(ulid()),
    })
    .returning()
    .then(([meetup]) => meetup);
}
