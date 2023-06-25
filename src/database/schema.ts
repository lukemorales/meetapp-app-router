import { date, pgTable, text, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { InferModel, relations } from 'drizzle-orm';

import { entityId, timestamps } from './utils';
import { MeetupId, UserId } from '../shared/entity-ids';
import { Email, HashedPassword } from '@/shared/validation';

const userId = entityId('user');

export const usersTable = pgTable(
  'users',
  {
    id: userId('id').primaryKey().notNull().$type<UserId>(),
    name: varchar('name', { length: 256 }).notNull(),
    email: varchar('email', { length: 256 }).notNull().$type<Email>(),
    passwordHash: varchar('password_hash', { length: 256 })
      .notNull()
      .$type<HashedPassword>(),
    ...timestamps,
  },
  (table) => ({
    emailIdx: uniqueIndex('unique_email_idx').on(table.email),
  }),
);

export type DatabaseUser = InferModel<typeof usersTable>;
export type User = Omit<DatabaseUser, 'passwordHash'>;

export const usersRelations = relations(usersTable, ({ many }) => ({
  meetups: many(meetupsTable),
}));

const meetupId = entityId('meetup');

export const meetupsTable = pgTable('meetups', {
  id: meetupId('id').primaryKey().notNull().$type<MeetupId>(),
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description').notNull(),
  location: varchar('location', { length: 256 }).notNull(),
  date: varchar('date').notNull(),
  organizerId: userId('organizer_id')
    .references(() => usersTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })
    .notNull()
    .$type<UserId>(),
  ...timestamps,
});

export const meetupsRelations = relations(meetupsTable, ({ one }) => ({
  organizer: one(usersTable, {
    fields: [meetupsTable.organizerId],
    references: [usersTable.id],
  }),
}));

export type Meetup = InferModel<typeof meetupsTable>;
