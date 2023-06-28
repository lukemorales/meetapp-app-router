import { meetupsTable, db } from '@/database';
import { MeetupId } from '@/shared/entity-ids';
import { formatMeetup } from '@/shared/meetup';
import { type InferModel, eq } from 'drizzle-orm';
import { ulid } from 'ulid';

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
    .then(([meetup]) => formatMeetup(meetup));
}

type UpdateMeetupOptions = Omit<CreateMeetupOptions, 'organizerId'>;

export async function updateMeetup(
  meetupId: MeetupId,
  options: UpdateMeetupOptions,
) {
  return db
    .update(meetupsTable)
    .set(options)
    .where(eq(meetupsTable.id, meetupId))
    .returning()
    .then(([meetup]) => formatMeetup(meetup));
}
